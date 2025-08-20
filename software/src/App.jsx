import { useEffect, useState } from "react";
import Events from "./assets/components/events";
import StarsBackground from "./assets/components/stars";
import "./index.css";
import { v4 } from "uuid";
import Visibility from "./assets/components/visibily";

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

        console.log("Itens carregados:", items);
        setEvents(items);
      } catch (err) {
        console.error("Erro ao buscar feed:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-center items-start p-10">
        <div className="space-y-4 w-[500px]">
          <h1 className="text-3xl text-slate-200 font-bold text-center">
            Next Astronomical Events
          </h1>
          <Events events={events} />
          <h1 className="text-3xl text-slate-200 font-bold text-center">
            Sky Visibility
          </h1>
          <Visibility />
        </div>
      </div>
    </div>
  );
}

export default App;
