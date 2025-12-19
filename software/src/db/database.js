/**
 * @file database.js
 * @fileoverview
 * Module responsible for creating and maintaining the SQLite database used
 * by the weather station. It ensures the existence of the main readings table,
 * adds or removes columns according to previous system versions, and
 * exports the database connection instance.
 *
 * @version 1.0.0
 * @date 2025-09-19
 * @lastmodified 2025-11-28
 *
 * @author
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires better-sqlite3 For creating and managing the SQLite database.
 * @requires path For manipulating and resolving directory and file paths.
 * @requires fs For creating directories, ensuring storage structure.
 *
 * @description
 * This module ensures that the `sensores.db` database exists inside the
 * `data/` folder and that the `leituras` table contains the necessary columns
 * to store up-to-date meteorological information. It also removes obsolete
 * columns from previous versions of the system.
 *
 * The `journal_mode = WAL` setting is used to allow concurrent access
 * and greater transaction safety.
 *
 * ### Table `leituras` structure
 * - `id` (INTEGER, PK, AUTOINCREMENT)
 * - `temperature` (REAL)
 * - `humidity` (REAL)
 * - `pressure` (REAL)
 * - `uvIndex` (TEXT)
 * - `cloudCover` (REAL)
 * - `rainProbability` (REAL)
 * - `precipitation` (REAL)
 * - `created_at` (TEXT)
 *
 * ### Global variables
 * - `dbPath` - Absolute path to the database file.
 * - `db` - SQLite database instance, opened or created.
 *
 * ### Main functions
 * - `addColumnIfNotExists(column, type, defaultValue = null)`  
 *   Checks if a column exists in the table and, if it does not exist,
 *   adds the column with the specified type and default value.
 *
 * - `deleteColumn(column)`  
 *   Checks if a column exists in the table and, if it exists,
 *   removes it from the database.
 *
 * - `renameColumn(oldName, newName)`
 *   Renames a column from `oldName` to `newName` if it exists and has not
 *   already been renamed.
 * 
 * - `renameTableIfExists(oldName, newName)`
 *    Renames a table from `oldName` to `newName` if it exists and the new name
 *    is not already taken.
 *
 * ### Runtime behavior
 * - Ensures the creation of the `leituras` table if it does not exist.
 * - Adds the columns `cloudCover`, `rainProbability`, and `precipitacao` if missing.
 * - Removes obsolete columns `ventoVelocidade` and `ventoDirecao` if present.
 * - Renames Portuguese columns to English equivalents for consistency.
 *
 * @example
 * // Importing and using the database:
 * import db from "./src/db/database.js";
 * const data = db.prepare("SELECT * FROM leituras").all();
 * console.log(data);
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

/**
 * Absolute path to the SQLite database file.
 * @type {string}
 */
const dbPath = path.resolve("data", "sensores.db");

/**
 * Ensures the folder exists. If not, creates it.
 */
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

/**
 * SQLite database instance.
 * @type {Database}
 */
const db = new Database(dbPath);

/**
 * Sets the journal mode to Write-Ahead Logging (WAL).
 * This allows concurrent read/write actions on the database.
 */
db.pragma("journal_mode = WAL");

// ************************************* FUNCTIONS ************************************* //
/**
 * Adds a column to the "weather_data" table if it does not exist.
 *
 * @function addColumnIfNotExists
 * 
 * @param {string} column - Column name to be added.
 * @param {string} type - Data type of the column.
 * @param {any} [defaultValue=null] - Default value for the new column (optional).
 * 
 * @returns {void} 
 */
function addColumnIfNotExists(column, type, defaultValue = null) {
  const info = db.prepare(`PRAGMA table_info("weather_data_final");`).all();
  const exists = info.some(col => col.name === column);
  
  if (!exists) {
    console.log(`Adding column '${column}' to table 'weather_data_final'...`);
    const defaultClause =
      defaultValue !== null
        ? `DEFAULT ${typeof defaultValue === "string" ? `'${defaultValue}'` : defaultValue}`
        : "";
    db.exec(`ALTER TABLE "weather_data_final" ADD COLUMN ${column} ${type} ${defaultClause}`);
  }
};

/**
 * Removes a column from the "weather_data" table if it exists.
 *
 * @function deleteColumn
 * 
 * @param {string} column - Column name to be removed.
 * 
 * @returns {void} 
 */
function deleteColumn(column) {
  const info = db.prepare(`PRAGMA table_info("weather_data_final");`).all();
  const exists = info.some(col => col.name === column);

  if(exists)
  {
    console.log(`Removing column '${column}' from table 'weather_data_final'...`);
    db.exec(`ALTER TABLE "weather_data_final" DROP COLUMN ${column}`);
  }
}

/**
 * Renames a column from oldName to newName if it exists.
 * 
 * @function renameColumn
 * 
 * @param {string} oldName - Existing column name
 * @param {string} newName - New column name
 * 
 * @returns {void}
 */
function renameColumn(oldName, newName) {
  const info = db.prepare(`PRAGMA table_info("weather_data_final");`).all();
  const exists = info.some(col => col.name === oldName);
  const alreadyRenamed = info.some(col => col.name === newName);

  if (exists && !alreadyRenamed) {
    console.log(`Renaming column '${oldName}' to '${newName}'...`);
    db.exec(`ALTER TABLE weather_data_final RENAME COLUMN ${oldName} TO ${newName}`);
  }
}

/**
 * Renames a table from oldName to newName if it exists.
 *
 * @function renameTableIfExists
 *
 * @param {string} oldName - Name of the existing table.
 * @param {string} newName - Desired new table name.
 *
 * @returns {void}
 */
function renameTableIfExists(oldName, newName) {
  // Check if the source table exists
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(oldName);

  if (!tableExists) return; // Nothing to rename

  // Check if the target table name already exists
  const newTableExists = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(newName);

  if (newTableExists) {
    console.log(`Table '${newName}' already exists. Skipping rename of '${oldName}'.`);
    return; // Prevents "there is already another table named..." errors
  }

  // Safely rename the table
  db.prepare(`ALTER TABLE ${oldName} RENAME TO ${newName}`).run();
  console.log(`Table '${oldName}' renamed to '${newName}'.`);
}

// Renames old table from previous versions if it exists
renameTableIfExists("dados_estacao_metereologica", "weather_data_final");

// Creates "weather_data" table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS weather_data_final (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL,
    humidity REAL,
    pressure REAL,
    uvIndex TEXT,
    cloudCover REAL,
    rainProbability REAL,
    precipitation REAL,
    created_at TEXT
  )
`);

// Adds missing columns for backward compatibility
addColumnIfNotExists("cloudCover", "REAL", 0);
addColumnIfNotExists("rainProbability", "REAL", 0);
addColumnIfNotExists("precipitation", "REAL", 0);

// Removes obsolete columns from previous versions
deleteColumn("ventoVelocidade");
deleteColumn("ventoDirecao");
deleteColumn("precipitacao");

// Renames columns from Portuguese to English
renameColumn("temperatura", "temperature");
renameColumn("umidade", "humidity");
renameColumn("pressaoAtm", "pressure");
renameColumn("uvClassificacao", "uvIndex");
renameColumn("precipitacao", "precipitation");

export default db;