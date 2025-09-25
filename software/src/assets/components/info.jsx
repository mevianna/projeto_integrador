import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000";

function Info() {
  const navigate = useNavigate();

  const [sensorData, setSensorData] = useState({
    temperatura: "-",
    umidade: "-",
    pressaoAtm: "-",
    uvClassificacao: "-"
  });

  // função que busca dados do ESP32 e salva no banco automaticamente
  async function fetchAndSaveData() {
    try {
      // busca os dados do ESP32
      const response = await fetch((`${API_URL}/dados`));
      const data = await response.json();
      setSensorData(data);

      // atualiza os dados no servidor
      await fetch(`${API_URL}/dados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      // salva os dados no banco imediatamente
      await fetch(`${API_URL}/dados/salvar`, {
        method: "POST",
      });

    } catch (error) {
      console.error("Erro ao atualizar/salvar dados:", error);
    }
  }

  useEffect(() => {
    // primeira execução
    fetchAndSaveData();

    // repete a cada 100s
    const interval = setInterval(fetchAndSaveData, 300000);
    return () => clearInterval(interval);
  }, []);

  function ViewHistory() {
    navigate("/history");
  }

  return (
    <div className="bg-purple-800 rounded-lg p-4 sm:p-6 md:p-8 mt-6 shadow w-full max-w-5xl mx-auto flex flex-col">
      <div className="flex text-sm md:text-xl font-bold items-center text-slate-200 gap-20">
        <div>
          <p>Temperature: {sensorData.temperatura} °C</p>
          <p>Humidity: {sensorData.umidade} %</p>
        </div>
        <div>
          <p>Wind Speed: -</p>
          <p>Wind Direction: -</p>
        </div>
        <div>
          <p>Atmospheric Pressure: {sensorData.pressaoAtm} Pa</p>
          <p>UV Index: {sensorData.uvClassificacao}</p>
        </div>
      </div>
      <div className="justify-end flex gap-3 mt-3">
        <button
          onClick={ViewHistory} // redireciona para histórico
          className="px-3 py-1 text-sm text-slate-200 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          View History
        </button>
      </div>
    </div>
  );
}

export default Info;
