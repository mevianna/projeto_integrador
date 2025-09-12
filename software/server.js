import express from "express";
import fetch from "node-fetch";
import cors from "cors";

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

// rota para receber dados do ESP32
app.post("/dados", (req, res) => {
  dadosESP = req.body;
  res.send("OK");
});

// permite acesso aos dados do ESP32
app.get("/dados", (req, res) => {
  res.json(dadosESP);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na rede!");
});