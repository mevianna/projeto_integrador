import { useNavigate } from "react-router-dom";

function Events({ events = [] }) {
  const navigate = useNavigate();

  const mapa = {
    "&deg;": "°",
    "&#39;": "'",
    "&ndash;": "–",
    "&ndash": "–",
    "&rsquo;": "’",
  };

  const regex = new RegExp(Object.keys(mapa).join("|"), "g");

  const filteredEvents = events.filter((event) => {
    const title = (event && event.title) || "";
    const tl = title.toLowerCase();
    return tl.includes("away") || tl.includes("tomorrow");
  });

  if (!events || events.length === 0)
    return <div className="text-slate-300 p-4">Carregando eventos...</div>;

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
            className="p-4 bg-purple-800 rounded-2xl shadow-md text-slate-200 hover:shadow-lg transition"
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

export default Events;
