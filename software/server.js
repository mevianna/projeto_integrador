import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import db from "./src/db/database.js";

const app = express();
app.use(cors());
const PORT = 4000;
app.use(express.json());
let dadosESP = {};

app.get("/events", async (req, res) => {
  try {
    const response = await fetch("https://in-the-sky.org/rss.php");
    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// rota para atualizar dadosESP
app.post("/dados", (req, res) => {
  dadosESP = req.body;
  res.json({ ok: true });
});

// rota para salvar no banco
app.post("/dados/salvar", (req, res) => {
  try {
    const { temperatura, umidade, pressaoAtm, uvClassificacao } = dadosESP;

    // se todos os valores forem nulos, não salva
    if (temperatura == null && umidade == null && pressaoAtm == null) {
      return res.status(400).json({ error: "Nenhum dado disponível para salvar" });
    }

    // pega o último registro do banco
    const last = db.prepare("SELECT * FROM leituras ORDER BY id DESC LIMIT 1").get();

    // se todos os valores forem iguais, não salva
    if (
      last &&
      last.temperatura === temperatura &&
      last.umidade === umidade &&
      last.pressaoAtm === pressaoAtm &&
      last.uvClassificacao === uvClassificacao
    ) {
      return res.json({ ok: true, message: "Último registro tem os mesmos valores, não salvou" });
    }

    // cria o comando para o banco de dados com valores genéricos
    const now = new Date(); // data e hora atual do computador
    const stmt = db.prepare(`
      INSERT INTO leituras (temperatura, umidade, pressaoAtm, uvClassificacao, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    // executa o comando com os valores reais
    const info = stmt.run(
      temperatura,
      umidade,
      pressaoAtm,
      uvClassificacao,
      now.toISOString() // data e hora no formato ISO
    );

    res.json({ ok: true, id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar no banco" });
  }
});

// rota para acessar os dados atuais
app.get("/dados", (req, res) => {
  res.json(dadosESP);
});

// rota para histórico
app.get("/dados/historico", (req, res) => {
  const rows = db.prepare("SELECT * FROM leituras ORDER BY id DESC LIMIT 50").all();
  res.json(rows);
});

app.listen(PORT, "0.0.0.0", () => 
  console.log("Servidor rodando na rede!"
));