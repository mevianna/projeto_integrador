import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function GraphsPage() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);

  // busca dados do backend
  useEffect(() => {
    fetch("http://localhost:4000/dados/historico")
      .then((res) => res.json())
      .then((data) => setHistorico(data))
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  }, []);

  // formata o tempo para exibir no eixo X
  const formatTime = (item) => new Date(item.data).toLocaleTimeString();

  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
        <div className="absolute inset-0 flex justify-around items-start p-10 w-screen h-screen">
          <div className="bg-purple-950 flex justify-center">
            <div className=" space-y-4 w-[900px]">
            <div className="flex justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-0 bottom-0 text-slate-100"
              >
                <ChevronLeftIcon />
              </button>
              <h1 className="text-slate-200 text-center text-xl font-bold mb-2">
                Graphs
              </h1>
            </div>

            {historico.length === 0 ? (
              <p className="text-slate-300 text-center">
                Nenhum dado registrado ainda.
              </p>
            ) : (
              <div className="bg-purple-800 p-6 rounded-md shadow h-[400px]">
                <h2 className="text-slate-200 text-center text-lg font-bold mb-2">
                  Temperatura (°C)
                </h2>
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={historico}>
                        <CartesianGrid>
                          <XAxis 
                            dataKey="data" 
                            tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                            stroke="#ccc"
                          />
                          <YAxis 
                            label={{ value: "°C", angle: -90, position: "insideBottom", fill: "#ccc" }} 
                            stroke="#ccc"
                          />
                        </CartesianGrid>
                      <Tooltip 
                        labelFormatter={(value) => formatTime(value)} 
                        formatter={(value) => [`${value} °C`, "Temperatura"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="temperatura" 
                        stroke="#ff7300" 
                        strokeWidth={2} 
                        dot={true} 
                        isAnimationActive={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphsPage;