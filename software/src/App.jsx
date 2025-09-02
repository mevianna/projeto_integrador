import { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Events from "./assets/components/events";
import StarsBackground from "./assets/components/stars";
import "./index.css";
import Visibility from "./assets/components/visibily";
import Info from "./assets/components/info";

function App() {
  /*a função useState é usada para armazenar valores que podem sofrer mudanças, nós colocamos a variavel que sofrerá constantemente as alterações 
  (events) e ao lado o método de mudança (setEvents), dentro da função colocamos o seu valor inicial
*/
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );

  // mesma coisa porem para usar o loading e caso tenha erros
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  //useEffect:
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]); // o '[events]' chamamos de callback, ele com a variavel significa que será chamado sempre que ela sofrer alterações

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setEventsError(null);
      try {
        console.log("Fetching events...");
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
  }, []);

  const navigate = useNavigate();

  function ViewAbout() {
    const query = new URLSearchParams();
    navigate(`/about`);
  }

  return (
    <div className="w-full min-h-screen flex justify-center gap-4 p-4 relative overflow-x-hidden">
      <StarsBackground />
      <div>
        <button
          onClick={() => ViewAbout()}
          className="absolute top-4 right-4 p-3 z-50 mt-3 px-3 py-3 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          <InfoIcon />
        </button>
      </div>
      <div className="inset-0 sm:p-6 md:p-8 p-4 relative z-10 flex flex-col items-center space-y-6 w-full max-w-5xl">
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

        <h1 className=" sm:text-2xl md:text-3xl text-xl text-slate-200 font-bold text-center">
          Sky Visibility
        </h1>
        <Visibility />
        <Info />
      </div>
    </div>
  );
}

export default App;
