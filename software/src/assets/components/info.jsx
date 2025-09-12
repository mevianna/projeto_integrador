import { useNavigate } from "react-router-dom";

function Info() {
  const navigate = useNavigate();

  function ViewHistory() {
    const query = new URLSearchParams();
    navigate(`/history?`);
  }

  return (
    <div className="bg-purple-800 rounded-3xl p-4 sm:p-6 md:p-8 mt-6 shadow w-full max-w-5xl mx-auto flex flex-col">
      <div className="flex text-sm md:text-xl font-bold items-center text-slate-200 gap-20">
        <div>
          <p>Temperature: </p>
          <p>Humidity: </p>
        </div>
        <div>
          <p>Wind Speed: </p>
          <p>Wind Direction: </p>
        </div>
        <div>
          <p>Atmospheric Pressure: </p>
          <p>Rain: </p>
        </div>
      </div>
      <div className="justify-end flex">
        <button
          onClick={() => ViewHistory()}
          className="mt-3 px-3 py-1 text-sm text-slate-200 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          View history
        </button>
      </div>
    </div>
  );
}

export default Info;
