import React from "react";

function Visibility() {
  let data = new Date();

  const level = 70;

  return (
    <div className="bg-purple-800 rounded-lg p-4 mt-6 shadow w-full max-w-3xl mx-auto">
      <div className="flex justify-between text-white mb-2">
        <span className="font-bold">Today</span>
        <span>{data.toString().slice(0, 11)}</span>
      </div>
      <div className="w-100 bg-purple-900 h-4 rounded-md">
        <div
          className="h-4 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full"
          style={{ width: `${level}%` }}
        />
      </div>
      <div className="flex justify-between text-slate-300 w-100 text-sm mt-1">
        <span>Poor</span>
        <span>Moderate</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}

export default Visibility;
