import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import db from "./src/db/database.js";
import cron from "node-cron";

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

function salvarUltimoDado() {
  const { temperatura, umidade, pressaoAtm, uvClassificacao } = dadosESP;

  // não salva se não houver dados
  if (temperatura == null && umidade == null && pressaoAtm == null) {
    console.log("Nenhum dado disponível para salvar na hora cheia");
    return;
  }

  // verifica último registro para evitar duplicidade
  const last = db.prepare("SELECT * FROM leituras ORDER BY id DESC LIMIT 1").get();

  if (
    last &&
    last.temperatura === temperatura &&
    last.umidade === umidade &&
    last.pressaoAtm === pressaoAtm &&
    last.uvClassificacao === uvClassificacao
  ) {
    console.log("Último registro é igual, não salvou");
    return;
  }

  const stmt = db.prepare(`
    INSERT INTO leituras (temperatura, umidade, pressaoAtm, uvClassificacao, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    temperatura,
    umidade,
    pressaoAtm,
    uvClassificacao,
    new Date().toISOString()
  );

  console.log(`Salvou dado da hora cheia: ${new Date().toISOString()}`);
}

// agenda o salvamento a cada hora cheia usando node-cron
cron.schedule("0 0 * * * *", salvarUltimoDado);

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
  console.log("Servidor rodando na rede!")
);