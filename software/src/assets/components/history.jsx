/**
 * @file history.jsx
 * @fileoverview Painel de historico dos dados meteorológicos salvos no database.
 *
 * @version 1.0.0
 * @date 2025-09-19
 * @lastmodified 2025-11-26
 *
 * @author
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react Hooks do React (useState, useEffect, useCallback)
 * @requires ../components/scrollbar.css Estilos personalizados para scrollbar.
 *
 * @description
 * Os dados são carregados em blocos de 50 registros por requisição, utilizando
 * paginação baseada em `offset`. Um botão “Carregar mais” permite buscar o próximo
 * conjunto de registros. Quando não há mais itens disponíveis, o componente exibe uma
 * mensagem informativa ao usuário.
 *
 * ### Informações exibidas na tabela
 * Cada linha contém:
 * - Temperatura (°C)
 * - Umidade relativa (%)
 * - Pressão atmosférica (Pa)
 * - Índice UV (classificaçao em string)
 * - Cobertura de nuvens (%)
 * - Probabilidade de chuva (%)
 * - Precipitação acumulada (mm)
 * - Timestamp da leitura (`created_at`)
 *
 * ### Hooks utilizados
 * - `useState`: Armazena: lista de dados carregados, estado de paginação, flag de fim de dados.
 * - `useEffect`: Executa a primeira busca de dados ao montar o componente.
 * - `useCallback`: Memoiza funções como `loadMore` e `fetchData` para evitar recriação desnecessária.
 *
 * ### Funções principais
 * - `loadMore()`  
 *   Realiza uma nova requisição ao backend usando o próximo `offset`.
 *   Atualiza o estado da lista e detecta quando não há mais registros a carregar.
 *
 * ### Observações
 * - O componente utiliza paginação simples baseada em `limit` e `offset`.
 * - Estilos de rolagem personalizados são aplicados via `scrollbar.css`.
 * - O componente foi projetado para ser eficiente em listas longas, carregando dados sob demanda.
 */

import { useEffect, useState, useCallback } from "react";
import "../components/scrollbar.css";

/**
 * @component HistoryTable
 * @description
 * Componente que exibe uma tabela com o histórico de dados meteorológicos,
 * carregando sob demanda.
 * 
 *
 * @returns {JSX.Element} Interface com os dados históricos carregados.
 */
function HistoryTable() {
  /**
   * Armazena o histórico de dados carregados.
   * @type {[Array, Function]}
   */
  const [historico, setHistorico] = useState([]);

  /**
   * Estado de paginação do histórico.
   * @type {[number, Function]}
   */
  const [offset, setOffset] = useState(0);

  /**
   * Limite de registros por requisição.
   * @type {number}
   */
  const limit = 50;

  /**
   * Estado que armazena se há mais dados.
   * @type {[boolean, Function]}
   */
  const [hasMore, setHasMore] = useState(true);

  /**
   * Estado de carregamento.
   * @type {[boolean, Function]}
   */
  const [loading, setLoading] = useState(false);

  /**
   * Carrega mais dados do histórico do backend.
   * @async
   * @function loadMore
   * @returns {Promise<void>}
   * 
   */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/dados/historico?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();

      setHistorico(prev => [...prev, ...data]);

      if (data.length < limit) {
        setHasMore(false);
      } else {
        setOffset(prev => prev + limit);
      }
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    } finally {
      setLoading(false);
    }
  }, [offset, limit, loading, hasMore]);

  /**
   * Carrega os dados iniciais ao montar o componente.
   * @effect
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/dados/historico?limit=${limit}&offset=0`
        );
        const data = await res.json();
        setHistorico(data);

        if (data.length < limit) {
          setHasMore(false);
        } else {
          setOffset(limit);
        }
      } catch (err) {
        console.error("Erro ao carregar inicial:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
    <div className="flex justify-center items-start px-6 bg-transparent">
      <div className="bg-purple-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-[1000px] max-h-[80vh] overflow-y-auto border border-purple-700 history-scrollbar">
        {historico.length === 0 ? (
          <p className="text-slate-300 text-center">No data recorded yet.</p>
        ) : (
          <table className="w-full text-slate-200">
            <thead className="sticky top-0 bg-purple-900/90 backdrop-blur-md z-10">
              <tr className="border-b border-slate-600">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Temperature (°C)</th>
                <th className="p-3 text-left">Humidity (%)</th>
                <th className="p-3 text-left">Pressure (Pa)</th>
                <th className="p-3 text-left">UV Index</th>
                <th className="p-3 text-left">Cloud Cover (%)</th>
                <th className="p-3 text-left">Raind Probability (%)</th>
                <th className="p-3 text-left">Precipitation (mm)</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-purple-700/60 transition-colors"
                >
                  <td className="p-3">{row.id}</td>
                  <td className="p-3">{row.temperatura ?? "-"}</td>
                  <td className="p-3">{row.umidade ?? "-"}</td>
                  <td className="p-3">{row.pressaoAtm ?? "-"}</td>
                  <td className="p-3">{row.uvClassificacao ?? "-"}</td>
                  <td className="p-3">{row.cloudCover ?? "-"}</td>
                  <td className="p-3">
                    {(row.rainProbability * 100).toFixed(2) ?? "-"}
                  </td>
                  <td className="p-3">{row.precipitacao ?? "-"}</td>
                  <td className="p-3">
                    {row.created_at
                      ? new Date(row.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    <div className="flex justify-center relative mt-4">
        {hasMore && (
          <div className="justify-end flex gap-3 mt-9">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-3 py-1 absolute right-0 top-0 bottom-0 text-sm text-slate-200 bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              {loading ? "Carregando..." : "Carregar mais"}
            </button>
          </div>
        )}

        {!hasMore && historico.length > 0 && (
          <p className="text-center text-slate-300 mt-4">Todos os dados foram carregados.</p>
        )}
    </div>
    </div>
  );
}

export default HistoryTable;
