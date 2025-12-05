/**
 * @file graphs.jsx
 * @fileoverview Visualization component that displays historical temperature and humidity
 * charts using the Recharts library. Data is fetched from the backend and organized
 * in chronological order prior to rendering.
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
 * @requires prop-types For component prop type validation.
 * @requires react React Hooks (`useState`, `useEffect`)
 * @requires recharts Chart visualization components for React.
 *
 * @description
 * The **Graphs** component makes a request to the `/data/history` endpoint
 * and transforms the returned data into a suitable structure for display.
 *
 * Two independent charts are rendered:
 *  - **Temperature (°C)**: yellow line chart.
 *  - **Humidity (%)**: blue line chart.
 *
 * Each chart uses a custom tooltip (*CustomTooltip*), displaying:
 *  - Formatted reading date (dd/mm HH:MM)
 *  - Value corresponding to the selected point
 *
 * The X axes display dates converted into `Date` objects. Data is automatically
 * sorted from oldest to newest to ensure a continuous and temporally coherent line.
 *
 * ### Hooks used
 * - `useState`: Manages the local state containing the history already converted into Date objects.
 *
 * - `useEffect`: Performs the backend request on component mount and processes the response.
 *
 * ### Main functions
 * `CustomTooltip(props)`: Renders a styled tooltip containing the date and value of the selected point.
 *
 * ### Behavior
 * - If no data exists, the component displays an informational message.
 * - Charts are responsive thanks to the `ResponsiveContainer` component.
 * - The history is automatically ordered by timestamp (`created_at`).
 *
 * ### Notes
 * - The endpoint must return the date in a format compatible with `new Date()`.
 * - This component does not receive external props; all loading is internal.
 * - External styles (Tailwind + custom CSS) control layout and colors.
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
 * Custom tooltip used in Recharts charts to display detailed information
 * when hovering over a data point.
 *
 * The tooltip displays:
 * - The date formatted in the Brazilian standard (dd/mm - hh:mm)
 * - The temperature or humidity value, depending on the selected point
 *
 * The tooltip's appearance is manually styled via inline styles,
 * using a dark purple background and white text.
 *
 * @param {Object} props
 * @param {boolean} props.active - Indicates whether the tooltip should be displayed.
 * @param {Array} props.payload - Data of the selected point provided by Recharts.
 * @param {string|number|Date} props.label - X-axis label (data timestamp).
 *
 * @returns {JSX.Element|null} A formatted tooltip or `null` if inactive.
 *
 * @example
 * <Tooltip content={<CustomTooltip />} />
 *
 * @requires PropTypes For prop type validation.
 * @requires Intl.DateTimeFormat For date formatting.
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

    const labelName = key === "temperature" ? "Temperature" : "Humidity";

    const unit = key === "temperature" ? "°C" : "%";

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
 * Specification of the expected types for the `CustomTooltip` component
 * properties, ensuring validation during development.
 *
 * PropTypes used:
 * - `active`: Indicates whether the tooltip is visible (boolean).
 * - `payload`: Array containing the data of the currently selected chart point.
 * - `label`: Represents the value associated with the X-axis at that point (timestamp),
 *    which may be a string, number, or `Date` object.
 *
 * This validation helps detect incorrect component usage and facilitates
 * code maintainability.
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
 * Component that displays historical temperature and humidity charts
 * using the Recharts library. Data is fetched from the backend and organized
 * in chronological order before rendering.
 *
 * @returns {JSX.Element} Interface containing the temperature and humidity charts.
 */

function Graphs() {
  /**
   * Stores the loaded data history.
   * @type {[Array, Function]}
   */
  const [historico, setHistorico] = useState([]);

  /**
   * Loads the initial data when the component mounts.
   * @effect
   */
  useEffect(() => {
    fetch("http://localhost:4000/data/history")
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
          {/* Temperature */}
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
                  dataKey="temperature"
                  stroke="#f2ff00"
                  strokeWidth={3}
                  dot={{ fill: "#f2ff00" }}
                  isAnimationActive={true}
                  activeDot={{ r: 8, fill: "#f2ff00", stroke: "f2ff00" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity */}
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
                  dataKey="humidity"
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