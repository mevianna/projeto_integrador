import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { criarTabela, inserirLeitura, buscarHistorico } from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4000;

let dadosESP = {};

// Cria tabela ao iniciar
criarTabela().then(() => console.log("Tabela criada ou já existente"));

// Busca dados externos
app.get("/events", async (req, res) => {
  try {
    const response = await fetch("https://in-the-sky.org/rss.php");
    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Recebe dados do ESP32
app.post("/dados", async (req, res) => {
  dadosESP = req.body;
  try {
    await inserirLeitura(dadosESP);  // salva no MySQL
    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao salvar no MySQL");
  }
});

// Retorna último dado
app.get("/dados", (req, res) => {
  res.json(dadosESP);
});

// Retorna histórico completo
app.get("/historico", async (req, res) => {
  try {
    const historico = await buscarHistorico();
    res.json(historico);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar histórico");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na rede na porta ${PORT}`);
});