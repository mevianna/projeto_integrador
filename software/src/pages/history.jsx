import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import { useEffect, useState } from "react";

function HistoryPage() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);

  // busca dados do backend
  useEffect(() => {
    fetch("http://localhost:4000/dados/historico")
      .then((res) => res.json())
      .then((data) => setHistorico(data))
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  }, []);

  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-around items-start p-10">
        <div className="bg-purple-950 flex justify-center p-10 rounded-xl shadow-lg">
          <div className="space-y-4 w-[900px]">
            <div className="flex justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-0 bottom-0 text-slate-100"
              >
                <ChevronLeftIcon />
              </button>
              <h1 className="text-slate-200 text-center text-lg font-bold mb-2">
                History
              </h1>
            </div>

            {/* tabela de histórico */}
            <div className="space-y-4 bg-purple-800 p-6 rounded-md shadow max-h-[600px] overflow-y-auto">
              {historico.length === 0 ? (
                <p className="text-slate-300 text-center">
                  Nenhum dado registrado ainda.
                </p>
              ) : (
                <table className="w-full text-slate-200 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Temperatura (°C)</th>
                      <th className="p-2 text-left">Umidade (%)</th>
                      <th className="p-2 text-left">Pressão (Pa)</th>
                      <th className="p-2 text-left">Índice UV</th>
                      <th className="p-2 text-left">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-purple-700 transition-colors"
                      >
                        <td className="p-2">{row.id}</td>
                        <td className="p-2">{row.temperatura ?? "-"}</td>
                        <td className="p-2">{row.umidade ?? "-"}</td>
                        <td className="p-2">{row.pressaoAtm ?? "-"}</td>
                        <td className="p-2">{row.uvClassificacao}</td>
                        <td className="p-2">
                          {new Date(row.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;