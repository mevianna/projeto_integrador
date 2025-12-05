/**
 * @file windSerice.js
 * @fileoverview Utility for retrieving real-time wind speed and direction
 * based on the user's geolocation (with automatic fallback to São Paulo).
 * Uses the Open-Meteo API to fetch hourly data and returns the value
 * corresponding to the current hour.
 *
 * @version 1.0.0
 * @date 2025-12-28
 * @lastmodified 2025-12-05
 *
 * @author
 * Maria Eduarda Vianna <mewmvianna@gmail.com>
 *
 * @license Proprietary
 *
 * @requires navigator.geolocation Retrieves the user’s latitude and longitude.
 * @requires fetch Performs HTTP requests to the Open-Meteo API.
 *
 * @description
 * The `getWindData()` function attempts to obtain the user's geolocation.
 * If unsuccessful—due to permission denial or browser limitations—it falls
 * back to a default location (São Paulo, Brazil).
 *
 * Using the acquired coordinates, it queries the Open-Meteo API for:
 * - `windspeed_10m`
 * - `winddirection_10m`
 *
 * It then matches the returned hourly dataset with the current hour
 * (UTC-based) and returns the speed, direction, and timestamp.
 *
 * ### Returned object
 * ```js
 * {
 *   speed: Number | "-",
 *   direction: Number | "-",
 *   time: String       // ISO hour
 * }
 * ```
 *
 * ### Notes
 * - The function is `async` and should be awaited.
 * - If the current hour is not found in the API response,
 *   the function returns `{ speed: "-", direction: "-" }`.
 * - Uses the `timezone=auto` parameter for correct local hour mapping.
 */

export async function getWindData() {
  // Try to obtain the user's geolocation
  let lat, lon;

  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    lat = pos.coords.latitude;
    lon = pos.coords.longitude;

    // Default location if geolocation fails
  } catch (e) {
    console.warn("Geolocalização falhou, usando SP como fallback.");
    lat = -23.55;
    lon = -46.63;
  }

  // Fetch wind speed and direction from Open-Meteo
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=windspeed_10m,winddirection_10m&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const speedArray = data.hourly.windspeed_10m;
  const directionArray = data.hourly.winddirection_10m;
  const timeArray = data.hourly.time;

  // Build the current hour timestamp used by the API
  const now = new Date();
  const targetHour = now.toISOString().slice(0, 13) + ":00";

  // Find the index that matches the current hour
  const index = timeArray.findIndex(t => t.startsWith(targetHour));

  if (index === -1) {
    console.warn("Não encontrou hora correspondente na API.");
    return { speed: "-", direction: "-" };
  }

  // Return wind data for the matched hour
  return {
    speed: speedArray[index],
    direction: directionArray[index],
    time: timeArray[index],
  };
}
