/**
 * @file App.jsx
 * @fileoverview Main page of the web application, responsible for displaying
 * astronomical events, sky visibility, and additional information.
 * It also integrates backend calls to fetch the RSS events feed.
 *
 * @version 1.0.0
 * @date 2025-09-26
 * @lastmodified 2025-11-26
 *
 * @author
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react React Hooks (`useState`, `useEffect`)
 * @requires lucide-react Icon used in the information button (`InfoIcon`)
 * @requires react-router-dom Route navigation (`useNavigate`)
 * @requires ./assets/components/events Component responsible for rendering the event list
 * @requires ./assets/components/stars Animated starry background
 * @requires ./assets/components/visibily Sky visibility indicator
 * @requires ./assets/components/info Additional information displayed on the page
 *
 * @description
 * The **App** component is the home page of the astronomical application.
 * It:
 * - Retrieves astronomical events from the backend (`/events`)
 * - Stores events in `localStorage`
 * - Checks access to geolocation (required for sky visibility)
 * - Renders the main interface components
 *
 * ### Main flow
 * 1. Location permission check
 * 2. Loading events from the backend
 * 3. Converting the RSS XML feed → JSON
 * 4. Saving data to `localStorage`
 * 5. Rendering components (Events, Visibility, StarsBackground, Info)
 *
 * ### Component state
 * - `events`: loaded astronomical events
 * - `loadingEvents`: indicates API loading
 * - `eventsError`: error message if the request fails
 * - `locationGranted`: identifies whether location permission was granted
 *
 * ### Component effects
 * - Updates `localStorage` every time `events` changes
 * - Requests geolocation permission
 * - Fetches the XML feed and converts it to JSON
 *
 * ### Notes
 * - The backend must provide a valid RSS feed at `/events`
 * - The XML is manually converted to JSON using DOMParser
 */

import { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Events from "./assets/components/events";
import StarsBackground from "./assets/components/stars";
import Visibility from "./assets/components/visibility";
import Info from "./assets/components/info";

function App() {
  /**
   * State that stores the list of astronomical events.
   * Events are loaded from `localStorage` on initialization.
   * @type {[Array<Object>, Function]}
   */
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );

  /**
   * Indicates whether events are being loaded from the backend.
   * @type {[boolean, Function]}
   */
  const [loadingEvents, setLoadingEvents] = useState(false);

  /**
   * Stores an error message if the feed request fails.
   * If no error occurs, the value remains `null`.
   * @type {[string|null, Function]}
   */
  const [eventsError, setEventsError] = useState(null);

  /**
   * Indicates whether the user granted location access.
   * Used to determine when to start fetching events.
   * @type {[boolean, Function]}
   */
  const [locationGranted, setLocationGranted] = useState(false);

  /**
   * Updates `localStorage` whenever the event list changes.
   * This effect runs every time `events` is updated.
   * Ensures local persistence across user sessions.
   * @effect
   * @returns {void}
   */

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  /**
   * Requests geolocation permission from the user.
   * Executed only on component mount ([]).
   * Sets locationGranted to true regardless of success or failure,
   * ensuring that the application continues working even without permission.
   * @effect
   * @returns {void}
   */

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationGranted(true),
        () => setLocationGranted(true)
      );
    } else {
      setLocationGranted(true);
    }
  }, []);

  /**
   * Fetches astronomical events from the backend (RSS in XML) as soon as
   * location is granted.
   * Executed whenever `locationGranted` changes to `true`.
   * @effect
   * @async
   * @throws {Error} If an error occurs during the request or XML parsing.
   * @returns {Promise<void>}
   */

  useEffect(() => {
    const fetchEvents = async () => {
      if (!locationGranted) return;

      setLoadingEvents(true);
      setEventsError(null);
      try {
        console.log("Fetching events...");
        const response = await fetch("http://localhost:4000/events");

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const xmlText = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const items = Array.from(xml.querySelectorAll("item")).map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          description: item.querySelector("description")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
        }));
        console.log("Parsed events:", items.length);
        setEvents(items);

        console.log("Parsed events:", items.length);
        setEvents(items);
      } catch (err) {
        console.error("Erro ao buscar feed:", err);
        setEventsError(err.message || "Erro ao buscar eventos");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [locationGranted]);

  const navigate = useNavigate();

  const ViewAbout = () => navigate(`/about`);

  return (
    <div className="w-full min-h-screen flex justify-center gap-4 p-4 relative overflow-x-hidden">
      <StarsBackground />
      <div>
        <button
          onClick={ViewAbout}
          className="absolute top-3 right-2 sm:top-5 sm:right-3 md:top-10 md:right-6 p-2 sm:p-2 md:p-3 z-50 mt-3 text-sm rounded-3xl bg-purple-600 hover:bg-purple-700"
        >
          <InfoIcon />
        </button>
      </div>

      <div className="inset-0 sm:p-6 md:p-8 p-4 relative z-10 flex flex-col items-center space-y-6 w-full max-w-6xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-slate-200 font-bold text-center">
          Next Astronomical Events
        </h1>

        {loadingEvents ? (
          <div className="text-slate-300 text-center font-bold">
            Loading Events...
          </div>
        ) : eventsError ? (
          <div className="text-red-400">Erro: {eventsError}</div>
        ) : (
          <Events events={events} />
        )}

        <h1 className="sm:text-2xl md:text-3xl text-xl text-slate-200 font-bold text-center">
          Sky Visibility
        </h1>
        <Visibility />
        <Info />
      </div>
    </div>
  );
}

export default App;
