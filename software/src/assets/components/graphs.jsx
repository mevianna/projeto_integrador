/**
 * @file graphs.jsx
 * @fileoverview Componente de visualização que exibe gráficos históricos de temperatura e umidade
 * utilizando a biblioteca Recharts. Os dados são obtidos do backend e organizados
 * em ordem cronológica antes da renderização.
 *
 * @version 1.1.0
 * @date 2025-09-26
 * @lastmodified 2025-11-26
 *
 * @author
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires prop-types Para validação de tipos das props do componente.
 * @requires react Hooks do React (`useState`, `useEffect`)
 * @requires recharts Componentes de visualização de gráficos para React.
 *
 * @description
 * O componente **Graphs** faz uma requisição ao endpoint `/dados/historico`
 * e transforma os dados retornados em uma estrutura adequada para exibição.
 *
 * São renderizados dois gráficos independentes:
 *  - **Temperatura (°C)**: gráfico de linha amarelo.
 *  - **Umidade (%)**: gráfico de linha azul.
 *
 * Cada gráfico utiliza um tooltip customizado (*CustomTooltip*), exibindo:
 *  - Data da leitura formatada (dd/mm HH:MM)
 *  - Valor correspondente ao ponto selecionado
 *
 * Os eixos X exibem datas convertidas para objetos `Date`. Os dados são
 * automaticamente ordenados do mais antigo para o mais recente para garantir
 * uma linha contínua temporalmente coerente.
 *
 * ### Hooks utilizados
 * - `useState`: Gerencia o estado local contendo o histórico já convertido em objetos Date.
 *
 * - `useEffect`: Executa a chamada ao backend na montagem do componente e processa a resposta.
 *
 * ### Funções principais
 * `CustomTooltip(props)`: Renderiza um tooltip estilizado contendo data e valor do ponto selecionado.
 *
 * ### Comportamento
 * - Caso não existam dados, o componente exibe uma mensagem informativa.
 * - Os gráficos são responsivos graças ao componente `ResponsiveContainer`.
 * - O histórico é automaticamente ordenado por timestamp (`created_at`).
 *
 * ### Observações
 * - O endpoint deve retornar a data em formato compatível com `new Date()`.
 * - Este componente não recebe props externas; todo o carregamento é interno.
 * - Os estilos externos (Tailwind + CSS personalizado) controlam layout e cores.
 */

import PropTypes from "prop-types";
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

/**
 * @component CustomTooltip
 * @description
 * Tooltip customizado utilizado nos gráficos do Recharts para exibir
 * informações detalhadas ao passar o mouse sobre um ponto da linha.
 *
 * O tooltip exibe:
 * - A data formatada no padrão brasileiro (dd/mm - hh:mm)
 * - O valor da temperatura ou umidade, dependendo do ponto selecionado
 *
 * A aparência do tooltip é estilizada manualmente via inline styles,
 * utilizando um fundo roxo escuro e texto branco.
 *
 * @param {Object} props
 * @param {boolean} props.active - Indica se o tooltip deve ser exibido.
 * @param {Array} props.payload - Dados do ponto selecionado enviados pelo Recharts.
 * @param {string|number|Date} props.label - Rótulo do eixo X (timestamp do dado).
 *
 * @returns {JSX.Element|null} Um tooltip formatado ou `null` se inativo.
 *
 * @example
 * <Tooltip content={<CustomTooltip />} />
 *
 * @requires PropTypes Para validação dos tipos das props.
 * @requires Intl.DateTimeFormat Para formatação de datas.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(label));

    const key = payload[0].name;
    const value = payload[0].value;

    const labelName = key === "temperatura" ? "Temperature" : "Humidity";

    const unit = key === "temperatura" ? "°C" : "%";

    return (
      <div
        style={{
          backgroundColor: "#4B0082",
          color: "#ffffff",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "14px",
        }}
      >
        <p>{`Date: ${formattedDate}`}</p>
        <p>{`${labelName}: ${value}${unit}`}</p>
      </div>
    );
  }
  return null;
};

/**
 * @static
 * @name CustomTooltip.propTypes
 * @description
 * Especificação dos tipos esperados para as propriedades do componente
 * `CustomTooltip`, garantindo validação em tempo de desenvolvimento.
 *
 * PropTypes utilizados:
 * - `active`: Define se o tooltip está visível (booleano).
 * - `payload`: Array contendo os dados do ponto do gráfico atualmente selecionado.
 * - `label`: Representa o valor associado ao eixo X naquele ponto (timestamp), podendo ser
 *    uma string, número ou objeto `Date`.
 *
 * Esta validação ajuda a detectar usos incorretos do componente e facilita
 * a manutenção do código.
 */
CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
};

/**
 * @component Graphs
 * 
 * @description
 * Componente que exibe gráficos históricos de temperatura e umidade
 * utilizando a biblioteca Recharts. Os dados são obtidos do backend e organizados
 * em ordem cronológica antes da renderização.
 * 
 * @returns {<Jsx.Element>} Interface com os gráficos de temperatura e umidade.
 */
function Graphs() {
  /**
   * Armazena o histórico de dados carregados.
   * @type {[Array, Function]}
   */
  const [historico, setHistorico] = useState([]);

  /**
   * Carrega os dados iniciais ao montar o componente.
   * @effect
   */
  useEffect(() => {
    fetch("http://localhost:4000/dados/historico")
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data
          .map((item) => ({
            ...item,
            created_at: new Date(item.created_at),
          }))
          .sort((a, b) => a.created_at - b.created_at);

        setHistorico(formattedData);
      })
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  }, []);

  return (
    <>
      {historico.length === 0 ? (
        <p className="text-slate-300 text-center">No data recorded yet.</p>
      ) : (
        <div className="flex flex-col w-full space-y-6 p-4 sm:p-6 md:p-8">
          {/* TEMPERATURA */}
          <div className="bg-purple-800 rounded-md shadow h-[475px] w-full">
            <h2 className="text-slate-200 text-center text-lg font-bold mb-2">
              Temperature (°C)
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={historico}
                margin={{ top: 2, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="created_at"
                  stroke="#ccc"
                  tickFormatter={(value) =>
                    new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(value))
                  }
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  domain={[0, "auto"]}
                  label={{
                    value: "°C",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#ccc",
                  }}
                  stroke="#ccc"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="temperatura"
                  stroke="#f2ff00"
                  strokeWidth={3}
                  dot={{ fill: "#f2ff00" }}
                  isAnimationActive={true}
                  activeDot={{ r: 8, fill: "#f2ff00", stroke: "f2ff00" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* UMIDADE */}
          <div className="bg-purple-800 p-6 rounded-md shadow h-[475px] w-full">
            <h2 className="text-slate-200 text-center text-lg font-bold mb-2">
              Humidity (%)
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={historico}
                margin={{ top: 2, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="created_at"
                  stroke="#ccc"
                  tickFormatter={(value) =>
                    new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(value))
                  }
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{
                    value: "%",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#ccc",
                  }}
                  stroke="#ccc"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="umidade"
                  stroke="#00b8cb"
                  strokeWidth={3}
                  dot={{ fill: "#00b8cb" }}
                  isAnimationActive={true}
                  activeDot={{ r: 8, fill: "#00b8cb", stroke: "00b8cb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}

export default Graphs;
