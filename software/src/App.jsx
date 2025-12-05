/**
 * @file App.jsx
 * @fileoverview Página principal da aplicação web, responsável por exibir
 * eventos astronômicos, visibilidade do céu e informações adicionais.  
 * Também integra chamada ao backend para buscar o feed RSS de eventos.
 *
 * @version 1.0.0
 * @date 2025-09-26
 * @lastmodified 2025-11-26
 *
 * @author
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 * Beatriz Schulter Tartare <email_bia@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react Hooks do React (`useState`, `useEffect`)
 * @requires lucide-react Ícone utilizado no botão de informações (`InfoIcon`)
 * @requires react-router-dom Navegação entre rotas (`useNavigate`)
 * @requires ./assets/components/events Componente responsável por renderizar a lista de eventos
 * @requires ./assets/components/stars Fundo animado de estrelas
 * @requires ./assets/components/visibility Indicador de visibilidade do céu
 * @requires ./assets/components/info Informações adicionais exibidas na página
 *
 * @description
 * O componente **App** é a página inicial da aplicação astronômica.  
 * Ele:
 * - Obtém eventos astronômicos a partir do backend (`/events`)
 * - Armazena eventos em `localStorage`
 * - Verifica acesso à geolocalização (necessário para visibilidade do céu)
 * - Renderiza os componentes principais da interface
 *
 * ### Fluxo principal
 * 1. Verificação de permissão de localização  
 * 2. Carregamento dos eventos do backend  
 * 3. Conversão do feed RSS XML → JSON  
 * 4. Salvamento no `localStorage`  
 * 5. Renderização dos componentes (Events, Visibility, StarsBackground, Info)
 *
 * ### Estados do componente
 * - `events`: eventos astronômicos carregados
 * - `loadingEvents`: indica carregamento da API
 * - `eventsError`: mensagem de erro caso a requisição falhe
 * - `locationGranted`: identifica se a permissão de localização foi concedida
 *
 * ### Efeitos do componente
 * - Atualiza o `localStorage` sempre que `events` muda
 * - Solicita permissão de geolocalização
 * - Busca o feed XML e converte em JSON
 *
 * ### Observações
 * - O backend deve fornecer um feed RSS válido em `/events`
 * - O XML é convertido para JSON manualmente via DOMParser
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
   * Estado que armazena a lista de eventos astronômicos.
   * Os eventos são carregados do `localStorage` na inicialização.
   * @type {[Array<Object>, Function]}
   */
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );

  /**
   * Indica se os eventos estão sendo carregados do backend.
   * @type {[boolean, Function]}
   */
  const [loadingEvents, setLoadingEvents] = useState(false);

  /**
   * Armazena uma mensagem de erro caso a requisição do feed falhe.
   * Caso não haja erro, o valor permanece `null`.
   * @type {[string|null, Function]}
   */
  const [eventsError, setEventsError] = useState(null);

  /**
   * Indica se o usuário concedeu permissão de acesso à localização.
   * É usado para determinar quando iniciar a busca de eventos.
   * @type {[boolean, Function]}
   */
  const [locationGranted, setLocationGranted] = useState(false);

  /**
   * Atualiza o `localStorage` sempre que a lista de eventos é modificada.
   * Este efeito é disparado toda vez que `events` muda.
   * Garante persistência local entre sessões do usuário.
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  /**
   * Solicita permissão de geolocalização ao usuário.
   * Executado apenas na montagem do componente (`[]`).
   * Define `locationGranted` como verdadeiro independente do sucesso ou falha,
   * garantindo que a aplicação continue funcionando mesmo sem permissão.
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
   * Busca os eventos astronômicos do backend (RSS em XML) assim que a
   * localização for concedida.
   * Executado sempre que `locationGranted` mudar para `true`.
   * @effect
   * @async
   * @throws {Error} Se ocorrer erro na requisição ou parse do XML.
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
