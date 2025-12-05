export async function getWindData() {
  // 1. Tenta obter localização
  let lat, lon;

  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
  } catch (err) {
    console.warn("Geolocalização falhou, usando SP como fallback.");
    lat = -23.55;
    lon = -46.63;
  }

  // 2. Chama a API
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=windspeed_10m,winddirection_10m&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const speedArray = data.hourly.windspeed_10m;
  const directionArray = data.hourly.winddirection_10m;
  const timeArray = data.hourly.time;

  // 3. Pega hora atual sem segundos
  const now = new Date();
  const targetHour = now.toISOString().slice(0, 13) + ":00";

  // 4. Encontra índice correto
  const index = timeArray.findIndex(t => t.startsWith(targetHour));

  if (index === -1) {
    console.warn("Não encontrou hora correspondente na API.");
    return { speed: "-", direction: "-" };
  }

  return {
    speed: speedArray[index],
    direction: directionArray[index],
    time: timeArray[index],
  };
}
