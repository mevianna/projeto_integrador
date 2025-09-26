import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(label));
    return (
      <div style={{
        backgroundColor: "#4B0082",
        color: "#f2ff00",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "14px"
      }}>
        <p>{`Data: ${formattedDate}`}</p>
        <p>{`Temperatura: ${payload[0].value}°C`}</p>
        {payload[1] && <p>{`Umidade: ${payload[1].value}%`}</p>}
      </div>
    );
  }
  return null;
};

function GraphsPage() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);

  // busca dados do backend
  useEffect(() => {
    fetch("http://localhost:4000/dados/historico")
      .then((res) => res.json())
      .then((data) => { // converte os dados
        const formattedData = data.map(item => ({
          ...item,
          created_at: new Date(item.created_at) // mantém como Date mas convertido
        }));
        setHistorico(formattedData);
      })
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  }, []);

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
                    <LineChart
                      data={historico}
                      margin={{ top: 2, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="created_at"
                        stroke="#ccc"
                        tickFormatter={(value) =>
                          new Intl.DateTimeFormat('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          }).format(new Date(value))
                        }
                      />
                      <YAxis
                        domain={[0, 'auto']}
                        label={{ value: "°C", angle: -90, position: "insideLeft", fill: "#ccc" }}
                        stroke="#ccc"
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                      />
                      <Line
                        type="monotone"
                        dataKey="temperatura"
                        stroke="#f2ff00"
                        strokeWidth={2}
                        dot={true}
                        isAnimationActive={false}
                        activeDot={{ r: 8 }}
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