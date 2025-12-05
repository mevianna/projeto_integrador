/**
 * @file index.jsx
 * @fileoverview Main initialization file of the React application.
 * Responsible for configuring the application's routes and rendering
 * the root interface inside the DOM.
 *
 * @version 1.0.0
 * @date 2025-08-29
 * @lastmodified 2025-11-27
 *
 * @author
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react Base library for building interfaces (StrictMode).
 * @requires react-dom/client Responsible for rendering the application in the DOM (createRoot).
 * @requires react-router-dom Navigation library used for route management
 * (createBrowserRouter, RouterProvider).
 * @requires ./App.jsx Main component displayed at the root route (/).
 * @requires ./pages/eventpage.jsx Page that displays the list of astronomical events.
 * @requires ./pages/aboutpage.jsx “About” page describing the project.
 * @requires ./pages/historypage.jsx Page containing the forecast history.
 * @requires ./pages/graphspage.jsx Page with historical temperature and humidity graphs.
 *
 * @description
 * This file defines the entire routing structure of the application using
 * `createBrowserRouter`, assigning each path to a specific component.
 * It then renders the application inside the `#root` element using
 * React 18 and its strict mode (StrictMode).
 *
 * The navigation architecture allows the user to explore:
 * - The home page (App);
 * - The listing of astronomical events;
 * - The history of weather forecasts;
 * - The “About” page;
 * - The historical meteorological graphs.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EventsPage from "./pages/eventpage.jsx";
import AboutPage from "./pages/aboutpage.jsx";
import HistoryPage from "./pages/historypage.jsx";
import GraphPages from "./pages/graphspage.jsx";

/**
 * @constant router
 * @type {import("react-router-dom").Router}
 * @description
 * Defines the application's route structure using `createBrowserRouter`.
 * Each route corresponds to a specific page, which is rendered when
 * the user navigates to its respective path.
 *
 * ### Defined Routes
 * - `/`: Renders the **App** component, the home page.
 * - `/events`: Renders **EventsPage**, with a list of astronomical events.
 * - `/history`: Renders **HistoryPage**, displaying the forecast history.
 * - `/about`: Renders **AboutPage**, containing information about the project.
 * - `/history/graphs`: Renders **GraphPages**, displaying historical graphs.
 */

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/events",
    element: <EventsPage />,
  },

  {
    path: "/history",
    element: <HistoryPage />,
  },

  {
    path: "/about",
    element: <AboutPage />,
  },

  {
    path: "/history/graphs",
    element: <GraphPages />,
  },
]);

/**
 * Renders the React application into the `#root` DOM element.
 * @function render
 * @description
 * Initializes React 18 using `createRoot` and wraps the entire application
 * in `<StrictMode>`, ensuring warnings for unsafe practices and additional
 * checks during development.
 * The `RouterProvider` component injects the navigation system defined by
 * the `router` object, allowing page navigation without reloading the site.
 *
 * @returns {void}
 */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
