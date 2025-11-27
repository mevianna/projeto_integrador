/**
 * @file visibily.jsx
 * @fileoverview Componente de painel que exibe a visibilidade do céu com base
 * nos dados de cobertura de nuvens obtidos por API.
 *
 * @version 1.0.0
 * @date 2025-08-29
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartare@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react Hooks do React (`useState`, `useEffect`)
 * @requires ../../services/cloudService Função para obter dados de cobertura de nuvens
 *
 * @description
 * O componente consulta periodicamente a API de cobertura de nuvens e exibe uma barra
 * de visibilidade baseada na quantidade de nuvens presente no céu.
 *
 * O valor obtido é enviado também para o backend local, que utiliza a informação
 * para geração de previsões.
 *
 * A lógica de atualização funciona da seguinte forma:
 * - Ao montar o componente, uma requisição inicial é feita imediatamente.
 * - Em seguida, calcula-se o tempo restante até o próximo horário cheio.
 * - Quando a hora muda, inicia-se uma atualização automática a cada 1 hora.
 *
 *  ### Variáveis globais
 * - `API_URL`: URL base da API backend.
 * 
 * ### Dados exibidos
 * O painel apresenta:
 * - Indicador visual de visibilidade (barra horizontal)
 * - Data atual formatada
 * - Percentual de cobertura de nuvens
 * - Horário da última atualização
 *
 * ### Hooks utilizados
 * - `useState`: Armazena o estado atual de `{ value, time }` referente à cobertura de nuvens.
 * - `useEffect`: Controla a busca inicial e o agendamento das atualizações futuras.
 *
 * ### Funções principais
 * - `fetchCloud()`: Obtém a cobertura de nuvens via API, atualiza o estado e envia
 *   o valor para o backend (`/cloudcover`).
 *
 * ### Observações
 * - O valor de visibilidade é calculado como inverso da cobertura de nuvens:
 *   quanto maior a cobertura, menor a visibilidade (limitado entre 0 e 100).
 * - Em caso de erro nas requisições, mensagens são registradas no console.
 */

import { useEffect, useState } from "react";
import { getCloudCover } from "../../services/cloudService";

/**
 * Endereço base da API backend.
 * @constant {string}
 */
const API_URL = "http://localhost:4000";

/**
 * @component Visibility
 * @description
 * Componente que exibe a visibilidade do céu com base na cobertura de nuvens.
 * 
 * @returns {JSX.Element} Interface do painel de visibilidade.
 */
function Visibility() {
  /**
   * Estado que armazena o valor de cobertura de nuvens e o timestamp da leitura.
   * @type {[Object, Function]}
   * @property {number} value Percentual de cobertura de nuvens (0-100).
   * @property {string} time Timestamp da última leitura.
   */
  const [cloud, setCloud] = useState({ value: 0, time: null });

  /**
   * Busca a cobertura de nuvens via API e envia o valor para o backend.
   * Atualiza o estado local com os dados obtidos.
   * @async
   * @function fetchCloud
   * @returns {Promise<void>}
   */
  async function fetchCloud() {
    try {
    const data = await getCloudCover();
    setCloud(data);

    console.log("Enviando cloudCover:", data.value);

    const response = await fetch(`${API_URL}/cloudcover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cloudCover: data.value }),
    });

    if (!response.ok) throw new Error("Falha ao enviar cloudCover");

  } catch (err) {
    console.error("Erro ao buscar cloud cover ou enviar para predição:", err);
  }
}
  /**
   * Efeito que gerencia a busca inicial e o agendamento de atualizações
   * @effect
   */
  useEffect(() => {
    fetchCloud();
     const now = new Date();
    const msAteProximaHora =
      (60 - now.getMinutes()) * 60 * 1000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds();

    const timeout = setTimeout(() => {
      fetchCloud();
      const interval = setInterval(fetchCloud, 3600000);
      return () => clearInterval(interval);
    }, msAteProximaHora);

    return () => clearTimeout(timeout);
  }, []);

  /**
 * Data e nível calculado de visibilidade.
 *
 * @constant
 * @type {Date}
 * @description
 * `data` armazena o horário atual no momento da renderização do componente.
 */
  let data = new Date();

  /**
 * Nível de visibilidade do céu calculado a partir da cobertura de nuvens.
 *
 * @constant
 * @type {number}
 * @description
 * Converte o valor de `cloud.value` (cobertura de nuvens em %) para um nível
 * de visibilidade entre **0 e 100**, onde:
 * - 100% de nuvens = visibilidade **0**
 * - 0% de nuvens = visibilidade **100**
 *
 * A fórmula `-(cloud.value - 100)` equivale a `100 - cloud.value`.
 *  
 * `Math.min(100, ...)` garante que o valor não ultrapasse 100.
 *  
 * `Math.max(0, ...)` garante que o valor não fique abaixo de 0.
 */
  const level = Math.max(0, Math.min(100, -(cloud.value - 100)));

  return (
    <div className="bg-purple-800 rounded-3xl p-4 sm:p-6 md:p-8 mt-6 shadow  w-full max-h-5xl mx-auto space-y-4">
      <div className="flex justify-between text-white mb-2">
        <span className="font-bold">Today</span>
        <span>{data.toString().slice(0, 11)}</span>
      </div>
      <div className="w-100 bg-purple-900 h-6 rounded-full text-slate-200 font-bold ">
        <div
          className="h-6 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full text-right px-2 font-bold text-sm text-slate-200"
          style={{ width: `${level}%` }}
        ></div>
        <div
          className="text-sm font-bold text-slate-200 mx-auto py-1"
          style={{ transform: `translateX(${level - 2}%)` }}
        >
          {level}%
        </div>
      </div>
      <div className="flex justify-between text-slate-300 w-100 text-sm mt-1 py-3">
        <span>Poor</span>
        <span>Moderate</span>
        <span>Excellent</span>
      </div>
      <div className="flex justify-between text-white mb-2">
        <small className="text-sm text-slate-400">
          Updated: {new Date(cloud.time).toLocaleTimeString()}
        </small>
        <small className="text-sm font-bold text-slate-200">
          {cloud.value}% cloud cover
        </small>
      </div>
    </div>
  );
}

export default Visibility;