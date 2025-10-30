import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import db from "./src/db/database.js";
import cron from "node-cron";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
const PORT = 4000;
app.use(express.json());

let dadosESP = {}; // último dado recebido

// rota para eventos externos
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

  // salva imediatamente na primeira vez que receber dados
  if (!app.locals.primeiraConexao) {
    salvarUltimoDado();
    app.locals.primeiraConexao = true;
  }
});

// rota para atualizar dadosESP pelo refresh
app.post("/dados/refresh", (req, res) => {
  salvarUltimoDado();
  res.json({ ok: true });
});

app.get("/dados/ultimo", (req, res) => {
  try {
    const ultimoDado = db.prepare(`
      SELECT * FROM leituras
      ORDER BY datetime(created_at) DESC
      LIMIT 1
    `).get();

    res.json(ultimoDado);
  } catch (error) {
    console.error("Erro ao buscar último dado:", error);
    res.status(500).json({ error: "Erro ao buscar último dado" });
  }
});

// função para salvar último dado
function salvarUltimoDado() {
  const { temperatura, umidade, pressaoAtm, uvClassificacao } = dadosESP;

  // não salva se não houver dados
  if (temperatura == null && umidade == null && pressaoAtm == null) {
    console.log("Nenhum dado disponível para salvar");
    return;
  }

  const last = db
    .prepare("SELECT * FROM leituras ORDER BY id DESC LIMIT 1")
    .get();

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

  console.log(`Salvou dado: ${new Date().toISOString()}`);
}

// agenda o salvamento a cada hora redonda
cron.schedule("0 0 * * * *", salvarUltimoDado);
console.log("Agendamento de salvamento a cada hora cheia iniciado");

// rota para acessar dados atuais
app.get("/dados", (req, res) => {
  res.json(dadosESP);
});

// rota para histórico
app.get("/dados/historico", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM leituras ORDER BY id DESC LIMIT 50")
    .all();
  res.json(rows);
});

// define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/predict", async (req, res) => {
  try {
    const { cloudCover } = req.body;
    console.log("Cloud cover recebido:", cloudCover);

    const lastESP = db.prepare(`
      SELECT temperatura, umidade, pressaoAtm, created_at 
      FROM leituras
      ORDER BY datetime(created_at) DESC
      LIMIT 1
    `).get();

    if (!lastESP) return res.status(400).json({ error: "Sem dados do ESP" });

    const pressao_mbar = lastESP.pressaoAtm * 0.01;
    const date = new Date(lastESP.created_at);
    const hour = date.getHours();
    const dayofweek = date.getDay();
    const month = date.getMonth() + 1;

    const features = [
      pressao_mbar,
      lastESP.temperatura,
      lastESP.umidade,
      0, 0,
      cloudCover,
      hour, dayofweek, month,
      cloudCover, cloudCover, cloudCover,
      pressao_mbar, pressao_mbar, pressao_mbar,
      lastESP.temperatura, lastESP.temperatura, lastESP.temperatura,
      lastESP.umidade, lastESP.umidade, lastESP.umidade,
      0, 0, 0,
      lastESP.temperatura,
      pressao_mbar,
      0, 0
    ];

    console.log("Features geradas:", features);

    const pyPath = path.join(__dirname, "src", "python", "server.py");
    console.log("Executando Python em:", pyPath);

    const py = spawn("python", [pyPath]);
    let resultData = "";

    py.stdout.on("data", (data) => {
      console.log("Python stdout:", data.toString());
      resultData += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
    });

    py.on("close", (code) => {
      console.log(`Python finalizado com código: ${code}`);
      try {
        const parsed = JSON.parse(resultData);
        console.log("Predição retornada:", parsed);
        res.json(parsed);
      } catch (err) {
        console.error("Erro ao interpretar saída Python:", err, resultData);
        res.status(500).json({ error: "Falha ao interpretar resposta do modelo" });
      }
    });

    py.stdin.write(JSON.stringify({ features }));
    py.stdin.end();

  } catch (error) {
    console.error("Erro na rota /predict:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na rede na porta ${PORT}`);
});
