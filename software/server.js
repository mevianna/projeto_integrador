import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // libera CORS para o React

const PORT = 4000;

app.get("/events", async (req, res) => {
  try {
    const response = await fetch("https://in-the-sky.org/rss.php");
    const text = await response.text();
    res.send(text); // devolve o XML puro
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy rodando em http://localhost:${PORT}`);
});
