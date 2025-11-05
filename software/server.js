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

// caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// variáveis globais
let dadosESP = {}; // último dado recebido
let cloudCover = null; // cobertura de nuvens atual
let ultimaPrevisao = null;  // guarda última previsão

// funçao para gerar a previsão
async function gerarPrevisao(features = null) {
  return new Promise((resolve, reject) => {
    try {
      if (!features) {
          return reject("Sem dados atuais disponíveis");
      } else if(!Array.isArray(features) || features.length < 6) {
        return reject("Features inválidas para previsão");
      } else {
        const inputModel = [
        features[0], // pressao_mbar
        features[1], // temperatura
        features[2], // umidade
        features[4], // ventoVelocidade
        features[5], // ventoDirecao
        features[6], // cloudCover
        ]
        features = inputModel;
      }

      console.log("Gerando previsão com features:", features);

      const pyPath = path.join(__dirname, "src", "python", "server.py");
      const py = spawn("python", [pyPath]);

      let resultData = "";
      py.stdout.on("data", (data) => (resultData += data.toString()));
      py.stderr.on("data", (data) => console.error("Python stderr:", data.toString()));

      py.on("close", (code) => {
        console.log(`Processo Python finalizado com código: ${code}`);
        try {
          const parsed = JSON.parse(resultData);
          ultimaPrevisao = parsed;
          console.log("Nova previsão gerada:", parsed);
          resolve(parsed);
        } catch (err) {
          console.error("Erro ao interpretar saída Python:", err, resultData);
          reject("Erro ao interpretar resposta do modelo");
        }
      });

      py.stdin.write(JSON.stringify({ features }));
      py.stdin.end();

    } catch (error) {
      console.error("Erro ao gerar previsão:", error);
      reject(error);
    }
  });
}

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
app.post("/dados", async (req, res) => {
  dadosESP = req.body;
  res.json({ ok: true });

  const pressao_mbar = dadosESP.pressaoAtm * 0.01;
  const features = [
    pressao_mbar,
    dadosESP.temperatura,
    dadosESP.umidade,
    dadosESP.uvClassificacao,
    0,
    0,
    cloudCover ?? 0,
    0,
  ];

  if (!app.locals.primeiraConexao) {
    try {
      await gerarPrevisao(features);
      await salvarUltimoDado(features);
      app.locals.primeiraConexao = true;
    } catch (err) {
      console.error("Erro ao gerar previsão inicial:", err);
    }
  }
});

// rota para atualizar dadosESP pelo refresh
app.post("/dados/refresh", async (req, res) => {
  try {
    if (app.locals.executandoPrevisao) {
      return res.status(429).json({ error: "Previsão em execução, tente novamente." });
    }

    if (!dadosESP || Object.keys(dadosESP).length === 0) {
      console.warn("Nenhum dado atual do ESP disponível. Abortando previsão.");
      return res.status(400).json({ error: "Nenhum dado atual do ESP disponível." });
    }

    if (cloudCover == null) {
      console.warn("CloudCover ainda não disponível. Abortando previsão.");
      return res.status(400).json({ error: "CloudCover ainda não disponível." });
    }

    app.locals.executandoPrevisao = true;

    const pressao_mbar = dadosESP.pressaoAtm * 0.01;
    const features = [
      pressao_mbar,
      dadosESP.temperatura,
      dadosESP.umidade,
      dadosESP.uvClassificacao,
      0,
      0,
      cloudCover ?? 0,
      0,
    ];

    const previsao = await gerarPrevisao(features);
    await salvarUltimoDado(features);
    res.json({ ok: true, previsao });
  } catch (err) {
    console.error("Erro no refresh:", err);
    res.status(500).json({ error: "Erro ao gerar previsão ou salvar dado" });
  } finally {
    app.locals.executandoPrevisao = false;
  }
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
async function salvarUltimoDado(features = null) {
  if (!features || !Array.isArray(features)) {
    console.log("Nenhum dado válido recebido para salvar.");
    return;
  }

  // desestruturação correta conforme a ordem das features
  const [pressaoAtm, temperatura, umidade, uvClassificacao, ventoVelocidade, ventoDirecao, cloud, precipitacao] = features;

  // pega a probabilidade de chuva da última previsão (ou 0)
  const probabilidadeChuva = ultimaPrevisao?.prediction?.[0]?.[0] ?? 0;

  const last = db
    .prepare("SELECT * FROM leituras ORDER BY id DESC LIMIT 1")
    .get();

  if (
    last &&
    last.temperatura === temperatura &&
    last.umidade === umidade &&
    last.pressaoAtm === pressaoAtm &&
    last.uvClassificacao === uvClassificacao &&
    last.ventoDirecao === ventoDirecao &&
    last.ventoVelocidade === ventoVelocidade &&
    last.cloudCover === cloud &&
    last.rainProbability === probabilidadeChuva &&
    last.precipitacao === precipitacao
  ) {
    console.log("Último registro é igual, não salvou");
    return;
  }

  const stmt = db.prepare(`
    INSERT INTO leituras (temperatura, umidade, pressaoAtm, uvClassificacao, created_at, ventoVelocidade, ventoDirecao, cloudCover, rainProbability, precipitacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    temperatura,
    umidade,
    pressaoAtm,
    uvClassificacao,
    new Date().toISOString(),
    ventoVelocidade,
    ventoDirecao,
    cloud,
    probabilidadeChuva,
    precipitacao
  );

  console.log(`Salvou dado: ${new Date().toISOString()}`);
  const ultimo = db.prepare(`
    SELECT * FROM leituras ORDER BY id DESC LIMIT 1
  `).get();

  console.log("Dado salvo no banco:", ultimo);
}

// agenda o salvamento a cada hora redonda
cron.schedule("0 * * * *", async() => {
  console.log("Gerando nova previsão programada...");
  try {
    if (!dadosESP || Object.keys(dadosESP).length === 0) {
      console.warn("Nenhum dado atual do ESP disponível. Abortando previsão.");
      return;
    }

    if (cloudCover == null) {
      console.warn("CloudCover ainda não disponível. Abortando previsão.");
      return;
    }

    // monta as features com os dados atuais em memória
    const pressao_mbar = dadosESP.pressaoAtm * 0.01;
    const features = [
      pressao_mbar,
      dadosESP.temperatura,
      dadosESP.umidade,
      dadosESP.uvClassificacao,
      0,
      0,
      cloudCover ?? 0,
      0
    ];

    // gera a previsão com os dados atuais
    await gerarPrevisao(features);

    // salva os dados + previsão
    await salvarUltimoDado(features);

    console.log("Previsão e dados salvos com sucesso na hora cheia.");
  } catch (err) {
    console.error("Erro ao gerar previsão programada:", err);
  }
});

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

// rota para atualizar cloudCover
app.post("/cloudcover", (req, res) => {
   const { cloudCover: novoValor } = req.body;

  if (novoValor == null) {
    return res.status(400).json({ error: "cloudCover não enviado" });
  }
  cloudCover = novoValor;
  res.json({ ok: true, cloudCover });
});

// rota para obter última previsão
app.get("/predict", (req, res) => {
  if (!ultimaPrevisao) {
    return res.status(404).json({ error: "Nenhuma previsão gerada ainda" });
  }
  res.json({
    ultimaPrevisao,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na rede na porta ${PORT}`);
});