import { ChevronLeftIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function EventPage() {
  const navigate = useNavigate();

  const mapa = {
    "&deg;;": "°",
    "&#39;": "'",
  };

  const regex = new RegExp(Object.keys(mapa).join("|"), "g");

  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  return (
    <div className=" w-screen h-screen bg-purple-900 flex justify-center p-10">
      <div className=" space-y-4 w-[500px]">
        <div className="flex justify-center relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-0 bottom-0 text-slate-100"
          >
            <ChevronLeftIcon />
          </button>
          <h1 className=" text-slate-200 text-center text-lg font-bold mb-2">
            Descrição
          </h1>
        </div>
        <div className="space-y-4 p-6 bg-purple-800 rounded-md shadow">
          <h2 className="text-xl text-white font-bold">
            {title.split(":")[1]?.trim()}
          </h2>
          <p className="text-white">
            {description
              .slice(3, -5)
              .replace(regex, (match) => mapa(match) | match)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
