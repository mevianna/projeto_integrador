/**
 * @file cloudService.jsx
 * @fileoverview Provides a function to retrieve the current cloud cover
 * using the Open-Meteo API based on the user's geolocation.
 *
 * @version 1.0.0
 * @date 2025-08-23
 * @lastmodified 2025-12-05
 *
 * @author
 * Maria Eduarda Vianna <mewmvianna@gmail.com>
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 *
 * @license Proprietary
 *
 * @requires navigator.geolocation Obtains the user's geographic coordinates.
 * @requires fetch Performs the API request to Open-Meteo.
 *
 * @description
 * This module defines a function that retrieves the user's location,
 * queries the Open-Meteo API for hourly cloud-cover data, and returns the value
 * corresponding to the closest hour to the current local time. If the exact hour
 * is not found, the function falls back to the last available record.
 *
 * ### Returned fields
 * - `value` — Cloud-cover percentage for the matched hour.
 * - `time` — ISO timestamp associated with the cloud-cover value.
 *
 * ### Notes
 * - If geolocation fails, the function stops and returns `{ value: null, time: null }`.
 * - If the API returns no hourly cloud-cover data, the result is also null.
 */

export async function getCloudCover() {
  // Get user's latitude and longitude through the Geolocation API
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

  // Build request URL for hourly cloud-cover data
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=cloudcover&timezone=auto`;

  console.log(lat, lon);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Open-Meteo request error");
    const data = await response.json();

    const cloudArray = data?.hourly?.cloudcover;
    const timeArray = data?.hourly?.time;

    // If the API returned no usable data
    if (!cloudArray || cloudArray.length === 0)
      return { value: null, time: null };

    // Build the current local hour in ISO format (YYYY-MM-DDTHH:00)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");

    const currentHourString = `${year}-${month}-${day}T${hour}:00`;

    // Find the index matching the current hour
    const i = timeArray.findIndex((time) => time.startsWith(currentHourString));

    // If no exact match is found, use the last available value
    const indexToUse = i !== -1 ? i : cloudArray.length - 1;

    return {
      value: cloudArray[indexToUse],
      time: timeArray ? timeArray[indexToUse] : null,
    };
  } catch (err) {
    console.error("getCloudCover:", err);
    // On any error (API/geolocation), return null values
    return { value: null, time: null };
  }
}