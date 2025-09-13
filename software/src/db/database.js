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
    created_at TEXT
  )
`);

export default db;