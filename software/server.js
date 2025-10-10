import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import db from "./src/db/database.js";
import cron from "node-cron";
import { parseString } from "xml2js"; // Importa a função de análise

const app = express();
app.use(cors());
const PORT = 4000;
app.use(express.json());

let dadosESP = {}; // último dado recebido

// Função utilitária para analisar XML em JSON
function parseXmlToJs(xml) {
  return new Promise((resolve, reject) => {
    // Adicionei um timeout para a análise do XML, caso o arquivo seja muito grande (embora improvável)
    const timeout = setTimeout(() => {
      reject(new Error("XML parsing timed out"));
    }, 5000); // 5 segundos

    parseString(
      xml,
      { explicitArray: false, ignoreAttrs: true },
      (err, result) => {
        clearTimeout(timeout);
        if (err) {
          return reject(err);
        }
        // Navega até o array de itens do RSS
        const items = result?.rss?.channel?.item || [];
        resolve(items);
      }
    );
  });
}

// rota para eventos externos
app.get("/events", async (req, res) => {
  try {
    // 💡 Adicionando um abort controller para garantir que a requisição externa não trave o servidor
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos

    const response = await fetch("https://in-the-sky.org/rss.php", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`External API failed with status: ${response.status}`);
    }

    const text = await response.text();
    const eventsArray = await parseXmlToJs(text);

    // Sucesso: envia os eventos
    res.json(eventsArray);
  } catch (err) {
    console.error("ERRO CRÍTICO na rota /events:", err.message);

    // 💡 Correção: Retorna um array JSON vazio com status 200 (OK)
    // Isso garante que o frontend saia do estado de "Loading events..."
    res.status(200).json([]);
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na rede na porta ${PORT}`);
});
