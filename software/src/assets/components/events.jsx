/**
 * @file events.jsx
 * @fileoverview Component responsible for displaying filtered, formatted, and organized
 * astronomical events in responsive cards. Each event includes a title, processed
 * description, publication date, and a button to view details.
 *
 * The component performs:
 * - Filtering of events based on keywords ("today", "tomorrow", "away")
 * - Conversion of common HTML entities (&deg;, &ndash;, etc.)
 * - Navigation to the details page via query params
 * - Automatic handling of null fields
 *
 * @version 1.0.0
 * @date 2025-11-27
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react-router-dom For page navigation (`useNavigate`).
 * @requires prop-types For validating the props received by the component.
 *
 * @description
 * The **Events** component receives a list of events and displays only those
 * related to upcoming dates, using filtering based on terms such as:
 * - "today"
 * - "tomorrow"
 * - "away"
 * Before rendering:
 * - The title is cleaned, showing only the part after ":" (when present)
 * - The description has HTML entities replaced (° ’ – etc.)
 * - Each event card includes a *View details* button, which sends the complete
 *   event data via query string to `/events`.
 */

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @component Events
 * @description
 * Component that displays a list of filtered and formatted astronomical events.
 * @returns {JSX.Element} The Events component interface.
 */
function Events({ events = [] }) {
  const navigate = useNavigate();

  /**
   * Map of HTML entities to their respective Unicode characters.
   * Used to replace encoded occurrences in event text.
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
   * Dynamically generated regular expression containing all entities
   * present in {@link mapa}. Used to quickly find each one in the text
   * and replace them with their equivalents.
   * @type {RegExp}
   */
  const regex = new RegExp(Object.keys(mapa).join("|"), "g");

  /**
   * Filters the received events, returning only those whose title
   * contains words related to upcoming or recent events.
   * The filter considers the strings:
   * - "away"
   * - "tomorrow"
   * - "today"
   * @type {Array<Object>}
   * @param {Array<Object>} events List of events received by the component.
   * @returns {Array} Filtered list of events.
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
 * Typing of the properties expected by the Events component.
 * @property {Object[]} events List of events that will be displayed.
 * Each event must follow the structure defined below:
 * @property {string} events[].title
 * Event title. It may contain prefixes or HTML entities that will be processed before display.
 * @property {string} events[].description
 * Event description coming from the feed. It may include HTML entities and additional content that will be cleaned and formatted.
 * @property {string} events[].link
 * URL with more details about the event.
 * @property {string} events[].pubDate
 * Publication date of the news/event, usually in the format returned by the RSS feed.
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
