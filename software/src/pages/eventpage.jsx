import { ChevronLeftIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import { useState, useEffect } from "react";

function EventPage() {
  const navigate = useNavigate();

  const mapa = {
    "&deg;": "°",
    "&#39;": "'",
    "&ndash": "-",
  };

  const regex = new RegExp(Object.keys(mapa).join("|"), "g");

  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "";
  const description = searchParams.get("description") || "";
  const link = searchParams.get("link") || "";

  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [errorImage, setErrorImage] = useState(null);

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

  const getProcessedTitle = () => {
    if (!title) return "Título não disponível";

    const parts = title.split(":");
    return parts.length > 1 ? parts[1].trim() : title;
  };

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
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-around items-start p-10">
        <div className="bg-purple-950 flex justify-center p-10">
          <div className="space-y-4 w-[500px]">
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
            <div className="space-y-4 bg-purple-800 p-6 rounded-md shadow">
              <h2 className="text-xl text-white font-bold">
                {getProcessedTitle()}
              </h2>

              {loadingImage && (
                <p className="text-white text-center">Loading Image...</p>
              )}

              {errorImage && (
                <p className="text-red-400 text-center">
                  Erro ao carregar imagem: {errorImage}
                </p>
              )}

              {imageUrl && (
                <img
                  className="rounded-md h-auto  object-cover"
                  src={imageUrl}
                  alt="Imagem do evento"
                  onError={(e) => {
                    console.error("Erro ao carregar imagem");
                    e.target.style.display = "none";
                  }}
                />
              )}

              <p className="text-white whitespace-pre-wrap">
                {getProcessedDescription()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
