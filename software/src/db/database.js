// database.js
import mysql from 'mysql2/promise';

// Configuração da conexão
const pool = mysql.createPool({
  host: 'localhost',    // seu host local
  user: 'root',         // usuário do MySQL
  password: 'senha',    // senha do MySQL
  database: 'esp_data', // nome do banco
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para criar tabela caso não exista
export async function criarTabela() {
  const sql = `
    CREATE TABLE IF NOT EXISTS leituras (
      id INT AUTO_INCREMENT PRIMARY KEY,
      temperatura FLOAT,
      umidade FLOAT,
      pressao FLOAT,
      uvClassificacao VARCHAR(50),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const conn = await pool.getConnection();
  await conn.query(sql);
  conn.release();
}

// Função para inserir dados
export async function inserirLeitura(dado) {
  const sql = `
    INSERT INTO leituras (temperatura, umidade, pressao, uvClassificacao)
    VALUES (?, ?, ?, ?)
  `;
  const conn = await pool.getConnection();
  await conn.execute(sql, [
    dado.temperatura,
    dado.umidade,
    dado.pressao,
    dado.uvClassificacao
  ]);
  conn.release();
}

// Função para buscar histórico
export async function buscarHistorico() {
  const sql = `
    SELECT * FROM leituras ORDER BY timestamp DESC
  `;
  const conn = await pool.getConnection();
  const [rows] = await conn.execute(sql);
  conn.release();
  return rows;
}

export default pool;