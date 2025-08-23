// src/components/CloudInfo.jsx
import { useEffect, useState } from "react";
import { getCloudCover } from "../services/cloudService";

export default function CloudInfo() {
  const [cloud, setCloud] = useState({ value: null, time: null });
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
  }, []);

  return (
    <div className="bg-purple-950 p-10 rounded-lg text-slate-200 text-center">
      <h3 className="text-xl font-bold mb-2">Cloud Cover</h3>
      {loading ? (
        <p>Loading...</p>
      ) : cloud.value !== null ? (
        <>
          <p className="text-2xl font-semibold">{cloud.value}% cloud cover</p>
          {cloud.time && <small className="text-sm text-slate-400">Updated: {new Date(cloud.time).toLocaleTimeString()}</small>}
        </>
      ) : (
        <p className="text-red-300">Data unavailable</p>
      )}
    </div>
  );
}