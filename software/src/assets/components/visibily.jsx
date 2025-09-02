import { useEffect, useState } from "react";
import { getCloudCover } from "/home/beatriz/react/projeto_integrador/software/src/services/cloudService.jsx";

function Visibility() {
  const [cloud, setCloud] = useState({ value: 0, time: null });
  const [loading, setLoading] = useState(true);

  async function fetchCloud() {
    setLoading(true);
    const data = await getCloudCover();
    setCloud(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCloud();
    const timer = setInterval(fetchCloud, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, [cloud]);

  let data = new Date();
  const level = Math.max(0, Math.min(100, -(cloud.value - 100)));

  return (
    <div className="bg-purple-800 rounded-lg p-4 sm:p-6 md:p-8 mt-6 shadow  w-full max-h-5xl mx-auto space-y-4">
      <div className="flex justify-between text-white mb-2">
        <span className="font-bold">Today</span>
        <span>{data.toString().slice(0, 11)}</span>
      </div>
      <div className="w-100 bg-purple-900 h-6 rounded-md">
        <div
          className="h-6 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full"
          style={{ width: `${level}%` }}
        />
      </div>
      <div className="flex justify-between text-slate-300 w-100 text-sm mt-1">
        <span>Poor</span>
        <span>Moderate</span>
        <span>Excellent</span>
      </div>
      <div className="flex justify-between text-white mb-2">
        <small className="text-sm text-slate-400">
          Updated: {new Date(cloud.time).toLocaleTimeString()}
        </small>
        <small className="text-sm font-bold text-slate-200">
          {cloud.value}% cloud cover
        </small>
      </div>
    </div>
  );
}

export default Visibility;
