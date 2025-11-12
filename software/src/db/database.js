/**
 * @file database.js
 * @fileoverview
 * Módulo responsável pela criação e manutenção do banco de dados SQLite utilizado
 * pela estação meteorológica. Ele garante a existência da tabela principal de
 * leituras, adiciona ou remove colunas conforme versões anteriores do sistema e
 * exporta a instância de conexão com o banco.
 *
 * @version 1.0.0
 * @date 2025-09-19
 * @lastmodified 2025-11-11
 *
 * @author
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires better-sqlite3 Para criação e manipulação do banco de dados SQLite.
 * @requires path Para manipulação e resolução de caminhos de diretórios e arquivos.
 * @requires fs Para criação de diretórios, garantindo a estrutura de armazenamento.
 *
 * @description
 * Este módulo assegura que o banco de dados `sensores.db` exista dentro da pasta
 * `data/` e que a tabela `leituras` possua as colunas necessárias para armazenar
 * informações meteorológicas atualizadas. Também remove colunas obsoletas de
 * versões anteriores do sistema.
 *
 * A configuração `journal_mode = WAL` é utilizada para permitir acesso concorrente
 * e maior segurança nas transações.
 *
 * ### Estrutura da tabela `leituras`
 * - `id` (INTEGER, PK, AUTOINCREMENT)
 * - `temperatura` (REAL)
 * - `umidade` (REAL)
 * - `pressaoAtm` (REAL)
 * - `uvClassificacao` (TEXT)
 * - `cloudCover` (REAL)
 * - `rainProbability` (REAL)
 * - `precipitacao` (REAL)
 * - `created_at` (TEXT)
 *
 * ### Variáveis globais
 * - `dbPath` - Caminho absoluto do arquivo do banco de dados.
 * - `db` - Instância do banco SQLite aberta ou criada.
 *
 * ### Funções principais
 * - `addColumnIfNotExists(column, type, defaultValue = null)`  
 *   Verifica se uma coluna existe na tabela e, caso não exista,
 *   adiciona a coluna com o tipo e valor padrão especificados.
 *
 * - `deleteColumn(column)`  
 *   Verifica se uma coluna existe na tabela e, caso exista,
 *   remove-a do banco de dados.
 * 
 * - `tableExists()`
 *   Verifica se a tabela `leituras` existe no banco de dados. Retorna true
 *   se existir, false caso contrário.
 *
 * ### Comportamento em tempo de execução
 * - Garante a criação da tabela `leituras` caso não exista.
 * - Adiciona as colunas `cloudCover`, `rainProbability` e `precipitacao` se ausentes.
 * - Remove colunas obsoletas `ventoVelocidade` e `ventoDirecao` se presentes.
 *
 * @example
 * // Importando e utilizando o banco:
 * import db from "./src/db/database.js";
 * const dados = db.prepare("SELECT * FROM leituras").all();
 * console.log(dados);
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

/**
 * Caminho absoluto do arquivo do banco de dados SQLite.
 * @type {string}
 */
const dbPath = path.resolve("data", "sensores.db");

/**
 * Garante que a pasta existe. Se não existir, cria
 */
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

/**
 * Instância do banco de dados SQLite.
 * @type {Database}
 */
const db = new Database(dbPath);

/**
 * Configuração do modo de journal para Write-Ahead Logging (WAL).
 * Isso permite ações concorrentes de leitura e escrita no banco de dados.
 */
db.pragma("journal_mode = WAL");

// ************************************* FUNÇÕES ************************************* //
/**
 * Adiciona uma coluna à tabela "dados_estacao_metereologica" se ela não existir.
 *
 * @function addColumnIfNotExists
 * @param {string} column - Nome da coluna a ser adicionada.
 * @param {string} type - Tipo de dado da coluna.
 * @param {any} [defaultValue=null] - Valor padrão para a nova coluna (opcional).
 * 
 * @returns {void} 
 */
function addColumnIfNotExists(column, type, defaultValue = null) {
  const info = db.prepare(`PRAGMA table_info("dados_estacao_metereologica");`).all();
  const exists = info.some(col => col.name === column);
  
  if (!exists) {
    console.log(`Adicionando coluna '${column}' à tabela 'dados_estacao_metereologica'...`);
    const defaultClause =
      defaultValue !== null
        ? `DEFAULT ${typeof defaultValue === "string" ? `'${defaultValue}'` : defaultValue}`
        : "";
    db.exec(`ALTER TABLE "dados_estacao_metereologica" ADD COLUMN ${column} ${type} ${defaultClause}`);
  }
};

/**
 * Remove uma coluna da tabela "dados_estacao_metereologica" se ela existir.
 *
 * @function deleteColumn
 * @param {string} column - Nome da coluna a ser removida.
 * 
 * @returns {void} 
 */
function deleteColumn(column) {
  const info = db.prepare(`PRAGMA table_info("dados_estacao_metereologica");`).all();
  const exists = info.some(col => col.name === column);

  if(exists)
  {
    console.log(`Removendo coluna '${column}' da tabela 'dados_estacao_metereologica'...`);
    db.exec(`ALTER TABLE "dados_estacao_metereologica" DROP COLUMN ${column}`);
  }
}

/**
 * Verifica se a tabela "leituras" existe no banco de dados.
 * Se existe, retorna true; caso contrário, false.
 *
 * @function tableExists
 * 
 * @returns {boolean} Indica se a tabela "leituras" existe.
 */
function tableExists() {
  const stmt = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name = ?
  `);
  const result = stmt.get("leituras");
  return !!result; // as duas exclamações convertem para boolean
}

// Cria tabela "dados_estacao_metereologica" se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS dados_estacao_metereologica (
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

// Renomeia a tabela "leituras" para "dados_estacao_metereologica", se existir
if (tableExists()) {
  db.exec("ALTER TABLE leituras RENAME TO dados_meteorologicos");
}

// Caso alguma versão antiga do database não tenha essas colunas, adiciona elas, garantindo compatibilidade
addColumnIfNotExists("cloudCover", "REAL", 0);
addColumnIfNotExists("rainProbability", "REAL", 0);
addColumnIfNotExists("precipitacao", "REAL", 0);

// Remove colunas obsoletas de versões anteriores
deleteColumn("ventoVelocidade");
deleteColumn("ventoDirecao");

export default db;