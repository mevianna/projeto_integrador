import { useNavigate } from "react-router-dom";
function Events(props) {
  const navigate = useNavigate();

  const mapa = {
    "&deg;": "°",
    "&#39;": "'",
    "&ndash": "-",
  };

  const regex = new RegExp(Object.keys(mapa).join("|"), "g");

  function onSeeDetailClick(event) {
    const query = new URLSearchParams();
    query.set("title", event.title);
    query.set("description", event.description);
    query.set("link", event.link);
    query.set("pubDate", event.pubDate);
    navigate(`/events?${query.toString()}`);
  }
  const filteredEvents = props.events.filter(
    (event) =>
      event.title.toLowerCase().includes("away") ||
      event.title.toLowerCase().includes("tomorrow")
  );

  return (
    <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-3">
      {filteredEvents.map((event, index) => (
        <div
          key={event.id || event.title || index}
          className="p-4 bg-purple-800 rounded-2xl shadow-md text-slate-200 hover:shadow-lg transition"
        >
          <h2 className="text-lg font-bold mb-2">
            {event.title.split(":")[1]?.trim()}
          </h2>
          <p className="text-sm mb-2">
            {event.description
              .slice(3, -5)
              .replace(regex, (match) => mapa[match] || match)}
          </p>
          <p className="text-xs text-slate-400">{event.pubDate}</p>

          <button
            onClick={() => onSeeDetailClick(event)}
            className="mt-3 px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            View details
          </button>
        </div>
      ))}
    </div>
  );
}

export default Events;
