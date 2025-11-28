/**
 * @file events.jsx
 * @fileoverview Componente responsável por exibir eventos astronômicos filtrados,
 * formatados e organizados em cartões responsivos. Cada evento possui título,
 * descrição tratada, data de publicação e botão para visualizar detalhes.
 *
 * O componente realiza:
 * - Filtragem de eventos com base em palavras-chave ("today", "tomorrow", "away")
 * - Conversão de entidades HTML comuns (&deg;, &ndash;, etc.)
 * - Navegação para página de detalhes via query params
 * - Tratamento automático de campos nulos
 *
 * @version 1.0.0
 * @date 2025-11-27
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartare@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react-router-dom Para navegação entre páginas (`useNavigate`).
 * @requires prop-types Para validação das props recebidas pelo componente.
 *
 * @description
 * O componente **Events** recebe uma lista de eventos e exibe apenas aqueles
 * relacionados a datas próximas, usando filtragem por termos como:
 * - "today"
 * - "tomorrow"
 * - "away"
 * Antes da renderização:
 * - O título é limpo, exibindo apenas a parte após ":" (quando existente)
 * - A descrição tem entidades HTML substituídas (° ’ – etc.)
 * - Cada cartão de evento inclui um botão *View details*, que envia os dados
 *   completos do evento via query string para `/events`.
 */

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @component Events
 * @description
 * Componente que exibe uma lista de eventos astronômicos filtrados e formatados.
 * @returns {JSX.Element} Interface do componente Events.
 */
function Events({ events = [] }) {
  const navigate = useNavigate();

  /**
   * Mapa de entidades HTML para seus respectivos caracteres Unicode.
   * Usado para substituir ocorrências codificadas em textos de eventos.
   * @type {Object.<string, string>}
   */
  const mapa = {
    "&deg;": "°",
    "&#39;": "'",
    "&ndash;": "–",
    "&ndash": "–",
    "&rsquo;": "’",
  };

  /**
   * Expressão regular gerada dinamicamente contendo todas as entidades
   * presentes em {@link mapa}. Serve para localizar rapidamente cada uma
   * delas no texto e substituí-las por seus equivalentes.
   * @type {RegExp}
   */
  const regex = new RegExp(Object.keys(mapa).join("|"), "g");

  /**
   * Filtra os eventos recebidos, retornando apenas aqueles cujo título
   * contenha palavras relacionadas a eventos próximos ou recentes.
   * O filtro considera as strings:
   * - "away"
   * - "tomorrow"
   * - "today"
   * @type {Array<Object>}
   * @param {Array<Object>} events Lista de eventos recebidos pelo componente.
   * @returns {Array} Lista filtrada de eventos.
   */
  const filteredEvents = events.filter((event) => {
    const title = (event && event.title) || "";
    const tl = title.toLowerCase();
    return (
      tl.includes("away") || tl.includes("tomorrow") || tl.includes("today")
    );
  });

  if (!events || events.length === 0)
    return <div className="text-slate-300 p-4">Loading events...</div>;

  if (filteredEvents.length === 0)
    return (
      <div className="text-slate-300 p-4">
        Nenhum evento correspondente encontrado.
      </div>
    );

  return (
    <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3">
      {filteredEvents.map((event, index) => {
        const rawTitle = event?.title ?? "Untitled";
        const displayedTitle = (rawTitle.split(":")[1] ?? rawTitle).trim();

        const rawDesc = event?.description ?? "";
        const descProcessed =
          rawDesc.length > 8
            ? rawDesc.slice(3, -5).replace(regex, (m) => mapa[m] || m)
            : rawDesc.replace(regex, (m) => mapa[m] || m);

        const key = `event-${index}-${event?.link || ""}-${
          event?.pubDate || ""
        }`;

        function onSeeDetailClick() {
          const query = new URLSearchParams();
          if (event?.title) query.set("title", event.title);
          if (event?.description) query.set("description", event.description);
          if (event?.link) query.set("link", event.link);
          if (event?.pubDate) query.set("pubDate", event.pubDate);
          navigate(`/events?${query.toString()}`);
        }

        return (
          <div
            key={key}
            className="p-4 bg-purple-800 justify-center rounded-3xl shadow-md text-slate-200 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold mb-2">{displayedTitle}</h2>
            <p className="text-sm mb-2">{descProcessed}</p>
            <p className="text-xs text-slate-400">{event?.pubDate}</p>

            <button
              onClick={onSeeDetailClick}
              className="mt-3 px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              View details
            </button>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Tipagem das propriedades esperadas pelo componente Events.
 * @property {Object[]} events Lista de eventos que serão exibidos.  
 * Cada evento deve possuir a estrutura definida abaixo:
 * @property {string} events[].title
 * Título do evento. Pode conter prefixos ou entidades HTML que serão tratados antes da exibição.
 * @property {string} events[].description
 * Descrição do evento vinda do feed. Pode incluir entidades HTML e conteúdos adicionais que serão limpos e formatados.
 * @property {string} events[].link
 * URL com mais detalhes sobre o evento.
 * @property {string} events[].pubDate
 * Data de publicação da notícia/evento, geralmente no formato retornado pelo feed RSS.
 */
Events.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      link: PropTypes.string,
      pubDate: PropTypes.string,
    })
  ),
};

export default Events;
