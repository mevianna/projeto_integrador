import { useEffect, useState } from "react";
import Events from "./assets/components/events";
import StarsBackground from "./assets/components/stars";
import "./index.css";
import Visibility from "./assets/components/visibily";
import Info from "./assets/components/info";

function App() {
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // quando passado a lista vazia ele chama apenas uma vez
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:4000/events");
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        const items = [...xml.querySelectorAll("item")].map((item) => ({
          title: item.querySelector("title")?.textContent,
          link: item.querySelector("link")?.textContent,
          description: item.querySelector("description")?.textContent,
          pubDate: item.querySelector("pubDate")?.textContent,
        }));

        setEvents(items);
      } catch (err) {
        console.error("Erro ao buscar feed:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center gap-4 p-4 relative overflow-x-hidden">
      <StarsBackground />
      <div className="inset-0 justify-around p-10 relative z-10 flex flex-col items-center">
        <div className="space-y-4 w-[800px]">
          <h1 className="text-3xl text-slate-200 font-bold text-center">
            Next Astronomical Events
          </h1>
          <Events events={events} />
          <h1 className="text-3xl text-slate-200 font-bold text-center">
            Sky Visibility
          </h1>
          <Visibility />
          <Info />
        </div>
      </div>
    </div>
  );
}

export default App;
