import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Info() {
  const navigate = useNavigate();

  const [sensorData, setSensorData] = useState({
    temperatura: "-",
    umidade: "-",
    pressaoAtm: "-",
    uvClassificacao: "-"
  });

  async function fetchData() {
    try {
      const response = await fetch("http://IP_PC:4000/dados"); // alterar o IP de acordo com o IP do PC
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 100000); // atualiza a cada 100s
    return () => clearInterval(interval);
  }, []);

  function ViewHistory() {
    const query = new URLSearchParams();
    navigate(`/history?`);
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
      <div className="justify-end flex">
        <button
          onClick={() => ViewHistory()}
          className="mt-3 px-3 py-1 text-sm text-slate-200 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          View history
        </button>
      </div>
    </div>
  );
}

export default Info;