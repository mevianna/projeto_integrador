/**
 * @file infopage.jsx
 * @fileoverview Main page of the site, displaying
 *
 * @version 1.0.0
 * @date 2025-09-26
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires lucide-react Library responsible for rendering SVG icons used in navigation (ChevronLeftIcon).
 * @requires react-router-dom Manages navigation between routes and provides access to URL parameters (useNavigate, useSearchParams).
 * @requires ../assets/components/stars.jsx Visual component for rendering the animated star background.
 * @requires react React hooks (useState, useEffect, useCallback)
 *
 * @description
 * The **InfoPage** displays the latest meteorological readings recorded in the system.
 * The interface includes:
 *
 * - Navigation to the full history page (`/history`)
 * - Automatic API fetch when the component is mounted
 * - Table with the 5 most recent readings
 * - Responsive styling with TailwindCSS
 * - Animated starry background
 *
 * ### Hooks used
 * - `useState`: Stores the list of readings returned by the API.
 * - `useEffect`: Executes the initial request to obtain data when the page loads.
 */

import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import { useState, useEffect } from "react";

function InfoPage() {
  const navigate = useNavigate();
  const [leituras, setLeituras] = useState([]);

  useEffect(() => {
    fetch("/api/leituras")
      .then((res) => res.json())
      .then((data) => setLeituras(data))
      .catch(() => setLeituras([]));
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative flex flex-col items-center justify-center">
      <StarsBackground />

      <div className="bg-purple-950 w-[90%] sm:w-[50%] md:w-[70%] lg:w-[70%] h-[90%] rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col justify-between relative z-10">
        <div className="flex items-center justify-center relative">
          <button
            onClick={() => navigate("/history")}
            className="absolute left-0 text-slate-100 hover:text-slate-300 transition"
          >
            <ChevronLeftIcon size={24} />
          </button>
          <h1 className="text-slate-200 text-lg sm:text-xl md:text-2xl font-bold text-center">
            Reading History
          </h1>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center mt-4 bg-purple-800 rounded-2xl shadow-inner p-3 sm:p-4 md:p-6 overflow-hidden">
          {leituras.length === 0 ? (
            <p className="text-slate-300 text-center text-sm sm:text-base md:text-lg">
              No readings recorded yet.
            </p>
          ) : (
            <div className="w-full h-full overflow-hidden flex flex-col justify-center">
              <table className="w-full text-slate-200 text-xs sm:text-sm md:text-base">
                <thead>
                  <tr className="bg-purple-900 text-slate-100">
                    <th className="p-1 sm:p-2 text-left">Data</th>
                    <th className="p-1 sm:p-2 text-left">Temp (°C)</th>
                    <th className="p-1 sm:p-2 text-left">Umid (%)</th>
                    <th className="p-1 sm:p-2 text-left">Pressão</th>
                    <th className="p-1 sm:p-2 text-left">UV</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {leituras.slice(0, 5).map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-purple-700 hover:bg-purple-900/40 transition"
                    >
                      <td className="p-1 sm:p-2">{item.created_at}</td>
                      <td className="p-1 sm:p-2">{item.temperatura}</td>
                      <td className="p-1 sm:p-2">{item.umidade}</td>
                      <td className="p-1 sm:p-2">{item.pressaoAtm}</td>
                      <td className="p-1 sm:p-2">{item.uvClassificacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="text-center text-slate-400 text-xs sm:text-sm mt-2">
          © 2025 Lunaris Project
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
