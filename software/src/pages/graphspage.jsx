/**
 * @file graphspage.jsx
 * @fileoverview "Graphs" page of the site, displaying responsive
 * temperature and humidity charts based on collected historical data.
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
 * @requires ../assets/components/graphs.jsx Component that encapsulates all graph logic and visualization.
 *
 * @description
 * The **GraphsPage** displays fully responsive and interactive charts that
 * show time series of temperature and humidity.
 * It is part of the main system interface and integrates:
 * - Navigation via `useNavigate`
 * - Animated starry background (`StarsBackground`)
 * - The `Graphs` component, which encapsulates all graph-related logic
 *
 * @remarks
 * - This page does not make direct API calls.
 *   Data is loaded internally by the <Graphs /> component, keeping responsibility isolated.
 */

import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import Graphs from "../assets/components/graphs.jsx";

/**
 * @component GraphsPage
 * @description
 * "Graphs" page component.
 * Displays interactive temperature and humidity charts.
 * @returns {JSX.Element} Complete visual structure of the Graphs page.
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