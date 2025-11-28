/**
 * @file info.jsx
 * @fileoverview Meteorological panel of the main page. Displays the most recent
 * data collected by the server, including temperature, humidity, pressure,
 * cloud coverage, UV index, and rain probability predicted by the model.
 *
 * @version 1.0.0
 * @date 2025-08-29
 * @lastmodified 2025-11-26
 *
 * @author
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react-router-dom Page navigation (useNavigate)
 * @requires react React Hooks (useState, useEffect, useCallback)
 * @requires ../../services/windService.js Service for retrieving wind data
 *
 * @description
 * The `Info` component is responsible for:
 * - Periodically fetching (every 20 seconds) the latest meteorological record
 *   stored in the backend.
 * - Displaying the most recent values, including rain probability.
 * - Allowing manual refresh, which forces the server to generate a new forecast.
 * - Navigating to the full history screen.
 * - Integrating wind data obtained from an external service.
 *
 * ### Global variables
 * - `API_URL`: Base URL of the backend API.
 *
 * ### Hooks used
 * - `useState`: stores sensor data, last update timestamp, and refresh button state.
 * - `useEffect`: initializes automatic loading and sets the periodic interval.
 * - `useCallback`: memoizes internal functions (`fetchLastData`, `handleRefresh`).
 *
 * ### Main functions
 * - `fetchLastData()`: Fetches the latest record from the server and updates the state.
 * - `handleRefresh()`: Requests the server to generate a new forecast and refreshes the data.
 * - `ViewHistory()`: Redirects the user to the history page.
 * - `Info()`: Main React component responsible for rendering the data.
 *
 * ### Notes
 * - If the server does not return a forecast, the component displays "No prediction available".
 * - The refresh button displays an animation based on the `isRefreshing` state.
 */

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getWindData } from "../../services/windService.js";

/**
 * Base address of the backend API.
 * @constant {string}
 */
const API_URL = "http://localhost:4000";

/**
 * @component Info
 * @description
 * Displays the latest measurements from the weather station and allows
 * manually refreshing the forecast, as well as accessing the record history.
 *
 * @returns {JSX.Element} Interface with the most recent data.
 */

function Info() {
  const navigate = useNavigate();

  /**
   * Most recent data obtained from the server.
   * @typedef {Object} SensorData
   * @property {?number} temperature - Temperature in degrees Celsius.
   * @property {?number} humidity - Relative humidity in percentage.
   * @property {?number} pressureAtm - Atmospheric pressure in Pascal.
   * @property {string} uvClassification - UV index classification.
   * @property {?number} prediction - Rain probability (0 to 1).
   */

  /**
   * Stores the sensor data.
   * @type {[SensorData, Function]}
   */

  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    pressureAtm: null,
    uvClassification: "-",
    prediction: null,
    precipitation: null,
  });

  /**
   * Stores the date/time of the last received update.
   * @type {[Date|null, Function]}
   */
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Indicates whether the system is currently performing an update/refresh.
   * @type {[boolean, Function]}
   */
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Wind data.
   * @typedef {Object} Wind
   * @property {string} speed - Wind speed in km/h.
   * @property {string} direction - Wind direction in degrees.
   */

  /**
   * Wind data obtained from the external service.
   * @type {[Wind, Function]}
   */

  const [wind, setWind] = useState({
    speed: "-",
    direction: "-",
  });
  /**
   * Fetches the latest stored data record from the server.
   *
   * @async
   * @function fetchLastData
   * @returns {Promise<void>}
   */

  const fetchLastData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/dados/ultimo`);
      const data = await response.json();

      setSensorData({
        temperature: data.temperature,
        humidity: data.humidity,
        pressureAtm: data.pressureAtm,
        uvClassification: data.uvClassification,
        prediction: data.rainProbability,
        precipitation: data.precipitation,
      });

      try {
        const windData = await getWindData();
        setWind({
          speed: windData.speed,
          direction: windData.direction,
        });
      } catch (err) {
        console.error("Error fetching wind data:", err);
      }

      setLastUpdated(new Date(data.created_at));
    } catch (error) {
      console.error("Error fetching last data:", error);
    }
  }, []);

  /**
   * Manually performs a data refresh by calling the forecast-generation endpoint
   * and then reloading the most recent values.
   *
   * @async
   * @function handleRefresh
   * @returns {Promise<void>}
   */

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/dados/refresh`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Refresh error:", errorData.error || response.statusText);
        alert("Erro ao gerar previsão. Tente novamente mais tarde.");
        setIsRefreshing(false);
        return;
      }
      await fetchLastData();
    } catch (error) {
      console.error("Refresh error", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchLastData]);

  /**
   * Automatically loads the data when the component mounts
   * and updates it every 20 seconds.
   *
   * @effect
   */

  useEffect(() => {
    fetchLastData();

    const interval = setInterval(fetchLastData, 20000);
    return () => clearInterval(interval);
  }, [fetchLastData]);

  /**
   * Navigates to the measurement history page.
   *
   * @function ViewHistory
   */

  function ViewHistory() {
    navigate("/history");
  }

  /**
   * Formats the date/time of the last update for display in the layout.
   *
   * @type {string}
   */

  const formattedDateTime = lastUpdated
    ? lastUpdated.toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

  return (
    <div className="bg-purple-800 rounded-lg p-4 sm:p-6 md:p-8 mt-6 shadow w-full max-w-7xl mx-auto flex overflow-x-hidden flex-col">
      <div className="flex justify-between items-start">
        <div className="flex text-sm md:text-xl sm:text-sm font-bold text-slate-200 gap-10">
          <div>
            <p>
              Temperature:{" "}
              {sensorData.temperature !== null ? sensorData.temperature : "-"}{" "}
              °C
            </p>
            <p>
              Humidity:{" "}
              {sensorData.humidity !== null ? sensorData.humidity : "-"} %
            </p>
            <p>UV Index: {sensorData.uvClassification}</p>
          </div>
          <div>
            <p>
              Atmospheric Pressure:{" "}
              {sensorData.pressureAtm !== null
                ? Number(sensorData.pressureAtm).toFixed(2)
                : "-"}{" "}
              Pa
            </p>
            <p>Wind Speed: {wind.speed} km/h</p>
            <p>Wind Direction: {wind.direction}°</p>
          </div>
          <div>
            <p>
              Precipitation:{" "}
              {sensorData.precipitation !== null
                ? sensorData.precipitation
                : "-"}{" "}
              mm
            </p>
            <p>
              {isRefreshing ? (
                <p>Loading prediction...</p>
              ) : sensorData.prediction === null ? (
                <p>No prediction available</p>
              ) : sensorData.prediction !== null ? (
                <p>
                  Rain probability now:{" "}
                  {(sensorData.prediction * 100).toFixed(2)}%
                </p>
              ) : (
                <p>Loading prediction...</p>
              )}
            </p>
          </div>
          <div></div>
        </div>
        <button
          onClick={handleRefresh}
          className="px-3 py-1 text-sm text-slate-200 rounded-md flex right gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865 a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
      <div className="flex text-sm md:text-xl font-bold text-slate-200 gap-16"></div>
      <div className="flex justify-between items-center gap-3 mt-4 mb-2">
        <small className="text-sm text-slate-400">
          Updated: {formattedDateTime}
        </small>
        <button
          onClick={ViewHistory}
          className="px-3 py-1 text-sm text-slate-200 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          View History
        </button>
      </div>
    </div>
  );
}

export default Info;
