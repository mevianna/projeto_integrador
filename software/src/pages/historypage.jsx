/**
 * @file historypage.jsx
 * @fileoverview Página "History" do site, exibindo o histórico de dados.
 *
 * @version 1.0.0
 * @date 2025-09-26
 * @lastmodified 2025-11-26
 *
 * @author
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires lucide-react Biblioteca responsável pela renderização de ícones SVG utilizados na navegação (ChevronLeftIcon).
 * @requires react-router-dom Gerencia a navegação entre rotas e fornece acesso aos parâmetros da URL (useNavigate, useSearchParams).
 * @requires ../assets/components/stars.jsx Componente visual para renderização do fundo animado de estrelas.
 * @requires ../assets/components/history.jsx Componente que encapsula a lógica e visualização dos dados históricos.
 *
  * @description
 * A página **HistoryPage** exibe uma tabela com os dados históricos coletados.  
 * Ela faz parte da interface principal do sistema e integra:
 * - Navegação via `useNavigate`
 * - Componente `HistoryTable`, que encapsula toda a lógica da tabela de histórico
 *
 * @remarks
 * - Esta página não realiza chamadas diretas à API. Os dados são carregados
 *   internamente pelo componente <History />, mantendo a responsabilidade isolada.
 */

import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import HistoryTable from "../assets/components/history.jsx";

/**
 * @component Historypage
 * @description
 * Componente da página "History".
 * Exibe histórico de dados coletados.
 * @returns {JSX.Element} Estrutura visual completa da página History.
 */
function Historypage() {
  const navigate = useNavigate();

  function ViewGraphs() {
    navigate("/history/graphs");
  }

  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-around items-start p-10 w-screen h-screen">
        <div className="bg-purple-950 flex justify-center">
          <div className=" space-y-4 md:w-[900px] sm:w-[600px] w-[400px]">
            <div className="flex justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-0 bottom-0 text-slate-100"
              >
                <ChevronLeftIcon />
              </button>
              <h1 className=" text-slate-200 text-center text-xl font-bold mb-2">
                History
              </h1>
              <div className="justify-end flex gap-3 mt-3">
                <button
                  onClick={ViewGraphs} // redireciona para graficos
                  className="px-3 py-1 absolute right-0 top-0 bottom-0 text-sm text-slate-200 bg-purple-600 hover:bg-purple-700 rounded-lg"
                >
                  View Graphs
                </button>
              </div>
            </div>
            <div>
              <HistoryTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historypage;
