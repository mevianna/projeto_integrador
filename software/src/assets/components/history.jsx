/**
 * @file history.jsx
 * @fileoverview Panel displaying the historical meteorological data saved in the database.
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
 * @requires react React Hooks (useState, useEffect, useCallback)
 * @requires ../components/scrollbar.css Custom scrollbar styles.
 *
 * @description
 * Data is loaded in blocks of 50 records per request, using pagination based on `offset`.
 * A “Load more” button retrieves the next batch of records. When no additional items are
 * available, the component displays an informational message to the user.
 *
 * ### Information displayed in the table
 * Each row contains:
 * - Temperature (°C)
 * - Relative humidity (%)
 * - Atmospheric pressure (Pa)
 * - UV index (string classification)
 * - Cloud coverage (%)
 * - Rain probability (%)
 * - Accumulated precipitation (mm)
 * - Reading timestamp (`created_at`)
 *
 * ### Hooks used
 * - `useState`: Stores the loaded data list, pagination state, and end-of-data flag.
 * - `useEffect`: Performs the initial data fetch when the component mounts.
 * - `useCallback`: Memoizes functions such as `loadMore` and `fetchData` to avoid unnecessary recreation.
 *
 * ### Main functions
 * - `loadMore()`
 *   Performs a new backend request using the next `offset`.
 *   Updates the list state and detects when there are no more records to load.
 *
 * ### Notes
 * - The component uses simple pagination based on `limit` and `offset`.
 * - Custom scrolling styles are applied through `scrollbar.css`.
 * - The component is designed to be efficient with long lists, loading data on demand.
 */

import { useEffect, useState, useCallback } from "react";
import "../components/scrollbar.css";

/**
 * @component HistoryTable
 * @description
 * Component that displays a table with historical meteorological data,
 * loading entries on demand.
 *
 * @returns {JSX.Element} Interface containing the loaded historical data.
 */

function HistoryTable() {
  /**
   * Stores the history of loaded data.
   * @type {[Array, Function]}
   */

  const [history, setHistory] = useState([]);

  /**
   * Pagination state for the historical data.
   * @type {[number, Function]}
   */

  const [offset, setOffset] = useState(0);

  /**
   * Limit of records per request.
   * @type {number}
   */
  const limit = 50;

  /**
   * State that stores whether more data is available.
   * @type {[boolean, Function]}
   */
  const [hasMore, setHasMore] = useState(true);

  /**
   * Loading state.
   * @type {[boolean, Function]}
   */
  const [loading, setLoading] = useState(false);

  /**
   * Loads more historical data from the backend.
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
        `http://localhost:4000/data/history?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();

      setHistory((prev) => [...prev, ...data]);

      if (data.length < limit) {
        setHasMore(false);
      } else {
        setOffset((prev) => prev + limit);
      }
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    } finally {
      setLoading(false);
    }
  }, [offset, limit, loading, hasMore]);

  /**
   * Loads the initial data when the component mounts.
   * @effect
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/data/history?limit=${limit}&offset=0`
        );
        const data = await res.json();
        setHistory(data);

        if (data.length < limit) {
          setHasMore(false);
        } else {
          setOffset(limit);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="flex justify-center items-start px-6 bg-transparent">
        <div className="bg-purple-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-[1000px] max-h-[80vh] overflow-y-auto border border-purple-700 history-scrollbar">
          {history.length === 0 ? (
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
                {history.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-purple-700/60 transition-colors"
                  >
                    <td className="p-3">{row.id}</td>
                    <td className="p-3">{row.temperature ?? "-"}</td>
                    <td className="p-3">{row.humidity ?? "-"}</td>
                    <td className="p-3">{row.pressure ?? "-"}</td>
                    <td className="p-3">{row.uvIndex ?? "-"}</td>
                    <td className="p-3">{row.cloudCover ?? "-"}</td>
                    <td className="p-3">
                      {(row.rainProbability * 100).toFixed(2) ?? "-"}
                    </td>
                    <td className="p-3">{row.precipitation ?? "-"}</td>
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
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}

        {!hasMore && history.length > 0 && (
          <p className="text-center text-slate-300 mt-4">
            All data has been loaded.
          </p>
        )}
      </div>
    </div>
  );
}

export default HistoryTable;