/**
 * @file graphspage.jsx
 * @fileoverview Página "Graphs" do site, exibindo gráficos responsivos
 * de temperatura e umidade baseados em dados históricos coletados.
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
 * @requires ../assets/components/graphs.jsx Componente que encapsula a lógica e visualização dos gráficos.
 *
  * @description
 * A página **GraphsPage** exibe gráficos interativos e totalmente responsivos que
 * mostram séries temporais de temperatura e umidade.  
 * Ela faz parte da interface principal do sistema e integra:
 * - Navegação via `useNavigate`
 * - Fundo animado de estrelas (`StarsBackground`)
 * - Componente `Graphs`, que encapsula toda a lógica dos gráficos
 *
 * @remarks
 * - Esta página não realiza chamadas diretas à API. Os dados são carregados
 *   internamente pelo componente <Graphs />, mantendo a responsabilidade isolada.
 */

import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import Graphs from "../assets/components/graphs.jsx";

/**
 * @component GraphsPage
 * @description
 * Componente da página "Graphs".
 * Exibe gráficos interativos de temperatura e umidade.
 * @returns {JSX.Element} Estrutura visual completa da página Graphs.
 */
function GraphsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-around items-start p-10 w-screen h-screen overflow-y-auto">
        <div className="bg-purple-950 flex justify-center">
          <div className=" space-y-4 w-[400px] md:w-[900px] sm:w-[600px]">
            <div className="flex justify-center relative w-full">
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
            <div>
              <Graphs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphsPage;
