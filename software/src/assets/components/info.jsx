import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000";

function Info() {
  const navigate = useNavigate();

  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sensorData, setSensorData] = useState({
    temperatura: "-",
    umidade: "-",
    pressaoAtm: "-",
    uvClassificacao: "-",
  });

  // função para buscar dados do backend
  async function fetchData(save = false) {
    try {
      const response = await fetch(`${API_URL}/dados`);
      const data = await response.json();

      setSensorData(data);
      const now = new Date();
      setLastUpdated(now);

      if (save) {
        await fetch(`${API_URL}/dados/refresh`, { method: "POST" });
      }

      // salva no sessionStorage para cache temporário
      sessionStorage.setItem("sensorData", JSON.stringify(data));
      sessionStorage.setItem("lastUpdated", now.toISOString());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  // carregar dados no primeira acesso da página
  useEffect(() => {
    const savedData = sessionStorage.getItem("sensorData");
    const savedTime = sessionStorage.getItem("lastUpdated");

    if (savedData && savedTime) {
      // já tem cache, usa ele
      setSensorData(JSON.parse(savedData));
      setLastUpdated(new Date(savedTime));
    } else {
      // se não tiver cache, busca do backend
      fetchData();
    }

    // agenda atualização a cada hora cheia
    const now = new Date();
    const msAteProximaHora =
      (60 - now.getMinutes()) * 60 * 1000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds();

    const timeout = setTimeout(() => {
      fetchData();
      const interval = setInterval(fetchData, 3600000); // depois de 1h
      return () => clearInterval(interval);
    }, msAteProximaHora);

    return () => clearTimeout(timeout);
  }, []);

  function ViewHistory() {
    navigate("/history");
  }

  const formattedDateTime = lastUpdated
    ? lastUpdated.toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

  return (
    <div className="bg-purple-800 rounded-lg p-4 sm:p-6 md:p-8 mt-6 shadow w-full max-w-5xl mx-auto flex overflow-x-hidden flex-col">
      <div className="flex justify-between items-start">
        <div className="flex text-sm md:text-xl font-bold text-slate-200 gap-16">
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
        <button
          onClick={async () => {
            setIsRefreshing(true);
            await fetchData(true);
            setIsRefreshing(false);
          }}
          className="px-3 py-1 text-sm text-slate-200 rounded-md flex right gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865 a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-center gap-3 mt-6 mb-2">
        <small className="text-sm text-slate-400">
          Updated: {formattedDateTime}
        </small>
        <button
          onClick={ViewHistory}
          className="px-3 py-1 text-sm text-slate-200 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          View History
        </button>
      </div>
    </div>
  );
}

export default Info;
