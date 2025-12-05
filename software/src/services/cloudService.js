/**
 * @file cloudService.js
 * @fileoverview Client-side weather utility to obtain the user's geolocation,
 * query the Open-Meteo API and extract real-time cloud coverage aligned
 * to the current hour.
 *
 * @version 1.0.0
 * @date 2025-23-08
 * @lastmodified 2025-12-05
 *
 * @author
 * Maria Eduarda Vianna <mewmvianna@gmail.com>
 *
 * @license Proprietary
 *
 * @requires navigator.geolocation  Obtains latitude and longitude from browser.
 * @requires fetch                 Performs the request to the Open-Meteo API.
 *
 * @description
 * * This module provides a single function, `getCloudCover()`, which:
 *
 * 1. Retrieves the user's current geolocation (latitude/longitude).
 * 2. Calls the Open-Meteo weather API requesting hourly cloud-cover data.
 * 3. Finds the cloud-cover value corresponding to the current local hour.
 * 4. Returns an object containing:
 *      - `value`: percentage of cloud coverage
 *      - `time` : timestamp returned by the API for the matched hour
 *
 * If any error occurs (API error, geolocation failure, etc.),
 * the function returns `{ value: null, time: null }`.
 *
 * ### Main Function
 * - `getCloudCover()` — Fetches geolocation, queries Open-Meteo, resolves cloud cover for the current hour.
 *
 * ### Notes
 * - The API is queried using `timezone=auto`, ensuring alignment with the user's local time.
 * - Uses a fallback to the last available index if the exact hourly timestamp is not found.
 */

// Obtain user's geolocation (latitude and longitude)
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

  // Build the Open-Meteo API URL for hourly cloud-cover data in local timezone
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=cloudcover&timezone=auto`;

  console.log(lat, lon);
  try {
    console.log(url);

    // Perform request to Open-Meteo
    const response = await fetch(url);
    if (!response.ok) throw new Error("Open-Meteo request error");
    const data = await response.json();

    const cloudArray = data?.hourly?.cloudcover;
    const timeArray = data?.hourly?.time;

    // If API did not return cloud-cover values, return null object
    if (!cloudArray || cloudArray.length === 0)
      return { value: null, time: null };

    // --- Match cloud cover for the current hour ---
    const now = new Date();

    // Construct the timestamp string in the same format as Open-Meteo ("YYYY-MM-DDTHH:00")
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");

    const currentHourString = `${year}-${month}-${day}T${hour}:00`;

    // Find the index in the array where the timestamp matches the current hour
    const i = timeArray.findIndex((time) => time.startsWith(currentHourString));

    // If the exact timestamp is not found, fallback to the last available value
    const indexToUse = i !== -1 ? i : cloudArray.length - 1;

    // Return cloud-cover value + timestamp for the chosen hour
    return {
      value: cloudArray[indexToUse],
      time: timeArray ? timeArray[indexToUse] : null,
    };
  } catch (err) {
    console.error("getCloudCover:", err);

    // On any error (API, network, geolocation), return a null structure
    return { value: null, time: null };
  }
}
