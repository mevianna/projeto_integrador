/**
 * @file historypage.jsx
 * @fileoverview "History" page of the site, displaying the data history.
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
 * @requires lucide-react Library responsible for rendering SVG icons used in navigation (ChevronLeftIcon).
 * @requires react-router-dom Manages navigation between routes and provides access to URL parameters (useNavigate, useSearchParams).
 * @requires ../assets/components/stars.jsx Visual component for rendering the animated starry background.
 * @requires ../assets/components/history.jsx Component that encapsulates the logic and visualization of historical data.
 *
 * @description
 * The **HistoryPage** displays a table with collected historical data.
 * It is part of the main system interface and integrates:
 * - Navigation via `useNavigate`
 * - The `HistoryTable` component, which encapsulates all logic for the history table
 *
 * @remarks
 * - This page does not make direct API calls.
 *   Data is loaded internally by the <History /> component, keeping responsibility isolated.
 */

import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import HistoryTable from "../assets/components/history.jsx";

/**
 * @component Historypage
 * @description
 * "History" page component.
 * Displays collected historical data.
 * @returns {JSX.Element} Complete visual structure of the History page.
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
                  onClick={ViewGraphs} //Redirects the user to the charts page.
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