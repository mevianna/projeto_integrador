import { useEffect, useState } from "react";
// src/services/cloudService.js
export async function getCloudCover() {
  const { lat, lon } = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      (err) => reject(err)
    );
  });

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=cloudcover&timezone=auto`;

  console.log(lat, lon);
  try {
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Open-Meteo request error");
    const data = await response.json();

    const cloudArray = data?.hourly?.cloudcover;
    const timeArray = data?.hourly?.time;
    if (!cloudArray || cloudArray.length === 0)
      return { value: null, time: null };

    // Encontra o índice da hora mais próxima da atual
    const now = new Date();
    // Construção manual da string no horário local
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");

    const currentHourString = `${year}-${month}-${day}T${hour}:00`;

    const i = timeArray.findIndex((time) => time.startsWith(currentHourString));

    // Se não encontrar o horário exato, pega o último (como fallback)
    const indexToUse = i !== -1 ? i : cloudArray.length - 1;

    return {
      value: cloudArray[indexToUse],
      time: timeArray ? timeArray[indexToUse] : null,
    };
  } catch (err) {
    console.error("getCloudCover:", err);
    return { value: null, time: null };
  }
}
