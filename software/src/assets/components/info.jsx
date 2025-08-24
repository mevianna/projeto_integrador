import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Info() {
  const navigate = useNavigate();
  const [cloudiness, setCloudiness] = useState();

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    console.log(lat, lon);
  });

  function ViewHistory() {
    const query = new URLSearchParams();
    navigate(`/history?`);
  }

  return (
    <div className="bg-purple-800 rounded-lg p-4 mt-6 shadow w-full max-w-3xl mx-auto">
      <div className="flex text-2x font-bold items-center text-slate-200 gap-20">
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
