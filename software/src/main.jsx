import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EventsPage from "./pages/eventpage.jsx";
import InfoPage from "./pages/infopage.jsx";
import AboutPage from "./pages/about.jsx";
import HistoryPage from "./pages/historypage.jsx";
import GraphPages from "./pages/graphspage.jsx";

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
    path: "/info",
    element: <InfoPage />,
  },

  {
    path: "/history/graphs",
    element: <GraphPages />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
