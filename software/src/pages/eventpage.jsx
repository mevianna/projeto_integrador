/**
 * @file eventpage.jsx
 * @fileoverview "Event" page of the site, displaying full details
 * about a selected astronomical event, including title, description,
 * image, additional information, and credits.
 *
 * This page retrieves dynamic information through URL parameters
 * and makes requests to internal backend APIs to fetch the first
 * related event image, alternative icon text, and credit data.
 *
 * @version 1.0.0
 * @date 2025-09-19
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 *
 * @license Proprietary
 *
 * @requires lucide-react Library responsible for rendering SVG icons used in navigation (ChevronLeftIcon).
 * @requires react-router-dom Manages route navigation and provides access to URL parameters (useNavigate, useSearchParams).
 * @requires ../assets/components/stars.jsx Visual component for rendering the animated starry background.
 * @requires react React hooks (useState, useEffect)
 *
 * @description
 * The "Event" page displays to the user a complete visualization
 * of an astronomical event selected from the main list.
 * It presents:
 * - Processed event title;
 * - Formatted description cleaned from HTML entities;
 * - Main image retrieved from an internal API;
 * - Alternative text for the icon (when available);
 * - Official image credits;
 * - Loading and error messages for each request;
 * - A safety notice about astronomical observation.
 *
 * The component performs three asynchronous backend calls:
 * 1. `/get_first_image` — returns the event's main image;
 * 2. `/get_icon` — returns alternative text or caption of the associated icon;
 * 3. `/get_credits` — returns the image credit text.
 *
 * ### Hooks used:
 * - `useState`: Stores local states such as the image URL, credits, and loading/error states.
 * - `useEffect`: Executes asynchronous requests whenever the event link changes.
 *
 * @remarks
 * - Parameters such as *title*, *description*, and *link* are received via URL.
 * - The description text may contain HTML entities, which are processed via regex.
 * - The image and credits are loaded independently, each with
 *   its own loading and error state.
 * - If the link is not provided, the requests are ignored.
 */

import { ChevronLeftIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import { useState, useEffect } from "react";

/**
 * @component EventPage
 * @description
 * "Event" page component.
 * Displays information about the selected astronomical event.
 *
 * @returns {JSX.Element} Complete visual structure of the Event page.
 */
function EventPage() {
  const navigate = useNavigate();

  /**
   * Map of HTML entities to special characters.
   * Used to replace entities in the event description.
   * @constant
   * @type {Object.<string, string>}
   */

  const mapa = {
    "&deg;": "°",
    "&#39;": "'",
    "&ndash": "-",
  };

  /**
   * Regular expression generated from the keys of the conversion map.
   * Used to replace HTML entities found in the description.
   * @type {RegExp}
   */
  const regex = new RegExp(Object.keys(mapa).join("|"), "g");

  /** @type {[URLSearchParams]} */
  const [searchParams] = useSearchParams();

  /**
   * Raw event title received via URL.
   * @type {string}
   */
  const title = searchParams.get("title") || "";

  /**
   * Raw event description received via URL.
   * @type {string}
   */
  const description = searchParams.get("description") || "";

  /**
   * Link to the official page of the astronomical event.
   * Used to request additional data from the backend.
   * @type {string}
   */
  const link = searchParams.get("link") || "";

  /**
   * URL of the main event image returned by the API.
   * @type {[string|null, Function]}
   */
  const [imageUrl, setImageUrl] = useState(null);

  /**
   * Alternative text or description of the event icon.
   * @type {[string|null, Function]}
   */
  const [iconalt, setIconAlt] = useState(null);

  /**
   * Image credit text.
   * @type {[string|null, Function]}
   */
  const [credit, setCredit] = useState(null);

  /** @type {[boolean, Function]} */
  const [loadingImage, setLoadingImage] = useState(true);

  /** @type {[boolean, Function]} */
  const [loadingCredit, setLoadingCredit] = useState(true);

  /** @type {[string|null, Function]} */
  const [errorImage, setErrorImage] = useState(null);

  /** @type {[string|null, Function]} */
  const [errorCredit, setErrorCredit] = useState(null);

  /**
   * Effect responsible for fetching the event’s first image.
   * Runs whenever `link` changes.
   * Sends a POST request to `/get_first_image`.
   * @async
   * @effect
   * @returns {Promise<void>}
   */

  useEffect(() => {
    if (link) {
      setLoadingImage(true);
      setErrorImage(null);

      const fetchImage = async () => {
        try {
          const response = await fetch(
            "http://127.0.0.1:5000/get_first_image",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ link: link }),
            }
          );

          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
          }

          const data = await response.json();
          setImageUrl(data.image_url);
        } catch (error) {
          console.error("Erro ao buscar imagem:", error);
          setErrorImage(error.message);
        } finally {
          setLoadingImage(false);
        }
      };

      fetchImage();
    } else {
      setLoadingImage(false);
    }
  }, [link]);

  /**
   * Effect responsible for fetching the alternative text of the event icon.
   * Runs whenever `link` changes.
   *
   * Sends a POST request to `/get_icon`.
   *
   * @async
   * @effect
   * @returns {Promise<void>}
   */

  useEffect(() => {
    if (link) {
      const fetchIcon = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/get_icon", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ link: link }),
          });

          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
          }

          const data = await response.json();
          setIconAlt(data.icon_alt);
        } catch (error) {
          console.error("Erro ao buscar icone:", error);
        }
      };
      fetchIcon();
    }
  }, [link]);

  /**
   * Effect responsible for fetching the image credits.
   * Runs whenever `link` changes.
   *
   * Sends a POST request to `/get_credits`.
   *
   * @async
   * @effect
   * @returns {Promise<void>}
   */

  useEffect(() => {
    if (link) {
      setLoadingCredit(true);
      setErrorCredit(null);
      const fetchCredit = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/get_credits", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ link: link }),
          });

          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
          }

          const data = await response.json();
          setCredit(data.credit_text);
        } catch (error) {
          console.error("Erro ao buscar credito:", error);
          setErrorCredit(error.message);
        } finally {
          setLoadingCredit(false);
        }
      };

      fetchCredit();
    } else {
      setLoadingCredit(false);
    }
  }, [link]);

  /**
   * Processes the raw title by removing prefixes before ":".
   *
   * @function
   * @returns {string} Clean and readable title.
   */

  const getProcessedTitle = () => {
    if (!title) return "Título não disponível";

    const parts = title.split(":");
    return parts.length > 1 ? parts[1].trim() : title;
  };

  /**
   * Processes and cleans the event description.
   * Removes HTML artifacts and unnecessary fragments.
   *
   * @function
   * @returns {string} Processed description.
   */

  const getProcessedDescription = () => {
    if (!description) return "Descrição não disponível";

    try {
      if (description.length >= 8) {
        return description
          .slice(3, -5)
          .replace(regex, (match) => mapa[match] || match);
      }
      return description.replace(regex, (match) => mapa[match] || match);
    } catch (error) {
      console.error("Erro ao processar descrição:", error);
      return description;
    }
  };

  return (
    <div className="w-screen h-screen relative ">
      <StarsBackground />
      <div className="inset-0 flex justify-around items-start relative">
        <div className="bg-purple-950 flex justify-center p-4 sm:p-6 md:p-8">
          <div className="space-y-4 w-[400px] sm:w-[600px] md:w-[800px]">
            <div className="flex justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-0 bottom-0 text-slate-100"
              >
                <ChevronLeftIcon />
              </button>
              <h1 className="text-slate-200 text-center text-lg font-bold mb-2">
                Description
              </h1>
            </div>
            <div className="space-y-4 bg-purple-800 p-6 rounded-3xl border-purple-900 border-y-2 border-x-2shadow">
              <div className="flex gap-4">
                <div>
                  {loadingImage && (
                    <p className="text-white text-center">Loading Image...</p>
                  )}

                  {errorImage && (
                    <p className="text-red-400 text-center">
                      Error loading image: {errorImage}
                    </p>
                  )}

                  {imageUrl && (
                    <img
                      className="rounded-3xl h-auto w-50 object-cover"
                      src={imageUrl}
                      alt="Imagem do evento"
                      onError={(e) => {
                        console.error("Erro ao carregar imagem");
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="text-left flex-1">
                  <h2 className="text-xl text-white font-bold">
                    {getProcessedTitle()}
                  </h2>
                  <p className="text-white whitespace-pre-wrap py-1 ">
                    {getProcessedDescription()}
                  </p>
                  {iconalt && (
                    <p className="text-white whitespace-pre-wrap py-4">
                      {iconalt.split("from")[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-purple-950 justify-center p-4 rounded-3xl">
                <h1 className="text-slate-200 text-lg font-bold mb-2">
                  ⚠️ Safety Notice
                </h1>
                <p className="text-slate-300 whitespace-pre-wrap ">
                  Never look directly at the Sun without certified solar filters
                  (ISO 12312-2). Do not use sunglasses, glass, or improvised
                  methods. For nighttime observations, choose safe locations.
                </p>
              </div>
              <div>
                <h2 className="text-slate-200 text-lg font-bold mb-2">
                  Image credit
                </h2>
                {loadingCredit && (
                  <p className="text-white text-left">Loading Credit...</p>
                )}

                {errorCredit && (
                  <p className="text-red-400 text-center">
                    Error loading credit: {errorCredit}
                  </p>
                )}
                {credit && (
                  <p className="text-white whitespace-pre-wrap py-2">
                    {credit}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
