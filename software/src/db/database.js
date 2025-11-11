import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.resolve("data", "sensores.db"); // cria o caminho para o arquivo do banco
fs.mkdirSync(path.dirname(dbPath), { recursive: true }); // garante que a pasta existe (se precisar, cria)

const db = new Database(dbPath); // abre ou cria o banco
db.pragma("journal_mode = WAL"); // modo JOURNAL no banco para ações concorrentes

// cria tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS leituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperatura REAL,
    umidade REAL,
    pressaoAtm REAL,
    uvClassificacao TEXT,
    cloudCover REAL,
    rainProbability REAL,
    precipitacao REAL,
    created_at TEXT
  )
`);

// função para adicionar coluna se não existir
function addColumnIfNotExists(table, column, type, defaultValue = null) {
  const info = db.prepare(`PRAGMA table_info(${table});`).all();
  const exists = info.some(col => col.name === column);
  
  if (!exists) {
    console.log(`Adicionando coluna '${column}' à tabela '${table}'...`);
    const defaultClause =
      defaultValue !== null
        ? `DEFAULT ${typeof defaultValue === "string" ? `'${defaultValue}'` : defaultValue}`
        : "";
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type} ${defaultClause}`);
  }
};

// função para deletar coluna indesejada se existir
function deleteColumn(table, column) {
  const info = db.prepare(`PRAGMA table_info(${table});`).all();
  const exists = info.some(col => col.name === column);

  if(exists)
  {
    console.log(`Removendo coluna '${column}' da tabela '${table}'...`);
    db.exec(`ALTER TABLE ${table} DROP COLUMN ${column}`);
  }
}

// caso alguma versão antiga não tenha essas colunas, adiciona elas
addColumnIfNotExists("leituras", "cloudCover", "REAL", 0);
addColumnIfNotExists("leituras", "rainProbability", "REAL", 0);
addColumnIfNotExists("leituras", "precipitacao", "REAL", 0);
// caso alguma versão antiga tenha essas colunas, remove elas
deleteColumn("leituras", "ventoVelocidade");
deleteColumn("leituras", "ventoDirecao");

export default db;