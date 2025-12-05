/**
 * @file visibily.jsx
 * @fileoverview Panel component that displays sky visibility based on
 * cloud coverage data obtained from an API.
 *
 * @version 1.0.0
 * @date 2025-08-29
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react React Hooks (`useState`, `useEffect`)
 * @requires ../../services/cloudService Function to fetch cloud coverage data
 *
 * @description
 * The component periodically queries the cloud coverage API and displays a
 * visibility bar based on the amount of clouds present in the sky.
 *
 * The obtained value is also sent to the local backend, which uses this
 * information for forecast generation.
 *
 * The update logic works as follows:
 * - When the component mounts, an initial request is executed immediately.
 * - Then, the remaining time until the next full hour is calculated.
 * - When the hour changes, an automatic update begins running every 1 hour.
 *
 *  ### Global variables
 * - `API_URL`: Base URL of the backend API.
 *
 * ### Displayed data
 * The panel shows:
 * - Visual visibility indicator (horizontal bar)
 * - Formatted current date
 * - Cloud coverage percentage
 * - Timestamp of the last update
 *
 * ### Hooks used
 * - `useState`: Stores the current `{ value, time }` state related to cloud coverage.
 * - `useEffect`: Controls the initial fetch and schedules future updates.
 *
 * ### Main functions
 * - `fetchCloud()`: Fetches cloud coverage data via API, updates the state, and sends
 *   the value to the backend (`/cloudcover`).
 *
 * ### Notes
 * - The visibility value is calculated as the inverse of cloud coverage:
 *   the higher the coverage, the lower the visibility (bounded between 0 and 100).
 * - In case of request errors, messages are logged to the console.
 */

import { useEffect, useState } from "react";
import { getCloudCover } from "../../services/cloudService";

/**
 * Base address of the backend API.
 * @constant {string}
 */
const API_URL = "http://localhost:4000";

/**
 * @component Visibility
 * @description
 * Component that displays sky visibility based on cloud coverage.
 *
 * @returns {JSX.Element} Visibility panel interface.
 */

function Visibility() {
  /**
   * State that stores the cloud coverage value and the reading timestamp.
   * @type {[Object, Function]}
   * @property {number} value Cloud coverage percentage (0–100).
   * @property {string} time Timestamp of the last reading.
   */
  const [cloud, setCloud] = useState({ value: 0, time: null });

  /**
   * Fetches cloud coverage data from the API and sends the value to the backend.
   * Updates the local state with the retrieved data.
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
   * Effect that handles the initial fetch and schedules future updates.
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
   * Current date and calculated visibility level.
   *
   * @constant
   * @type {Date}
   * @description
   * `data` stores the current timestamp at the moment the component renders.
   */
  let date = new Date();

  /**
   * Sky visibility level calculated from cloud coverage.
   *
   * @constant
   * @type {number}
   * @description
   * Converts the value of `cloud.value` (cloud coverage in %) into a visibility
   * level between **0 and 100**, where:
   * - 100% cloud coverage = **0** visibility
   * - 0% cloud coverage = **100** visibility
   *
   * The formula `-(cloud.value - 100)` is equivalent to `100 - cloud.value`.
   *
   * `Math.min(100, ...)` ensures the value does not exceed 100.
   *
   * `Math.max(0, ...)` ensures the value does not drop below 0.
   */

  const level = Math.max(0, Math.min(100, -(cloud.value - 100)));

  return (
    <div className="bg-purple-800 rounded-3xl p-4 sm:p-6 md:p-8 mt-6 shadow  w-full max-h-5xl mx-auto space-y-4">
      <div className="flex justify-between text-white mb-2">
        <span className="font-bold">Today</span>
        <span>{date.toString().slice(0, 11)}</span>
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