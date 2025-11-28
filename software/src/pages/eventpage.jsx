/**
 * @file eventpage.jsx
 * @fileoverview Página "Event" do site, exibindo detalhes completos
 * sobre um evento astronômico selecionado, incluindo título, descrição,
 * imagem, informações adicionais e créditos.
 *
 * Esta página obtém informações dinâmicas por meio de parâmetros de URL
 * e faz requisições às APIs internas do backend para recuperar a primeira
 * imagem relacionada ao evento, ícone alternativo e dados de crédito.
 *
 * @version 1.0.0
 * @date 2025-09-19
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartare@gmail.com>
 *
 * @license Proprietary
 *
 * @requires lucide-react Biblioteca responsável pela renderização de ícones SVG utilizados na navegação (ChevronLeftIcon).
 * @requires react-router-dom Gerencia a navegação entre rotas e fornece acesso aos parâmetros da URL (useNavigate, useSearchParams).
 * @requires ../assets/components/stars.jsx Componente visual para renderização do fundo animado de estrelas.
 * @requires react Hooks do React (useState, useEffect)
 *
 * @description
 * A página "Event" é responsável por exibir ao usuário uma visualização
 * completa de um evento astronômico selecionado na lista principal.  
 * Ela apresenta:
 * - Título processado do evento;
 * - Descrição formatada e tratada para remover entidades HTML;
 * - Imagem principal obtida pela API interna;
 * - Texto alternativo do ícone (quando disponível);
 * - Créditos oficiais da imagem;
 * - Mensagens de carregamento e erros para cada requisição;
 * - Aviso de segurança sobre observação astronômica.
 *
 * O componente executa três chamadas assíncronas ao backend:
 * 1. `/get_first_image` — retorna a imagem principal do evento;
 * 2. `/get_icon` — retorna texto alternativo ou legenda do ícone associado;
 * 3. `/get_credits` — retorna o texto de créditos da imagem.
 *
 * ### Hooks utilizados:
 * - `useState`: Armazena estados locais como URL da imagem, créditos, estados de loading e erros.
 * - `useEffect`: Executa as requisições assíncronas sempre que o link do evento muda.
 * 
 * @remarks
 * - Parâmetros como *title*, *description* e *link* são recebidos via URL.
 * - O texto da descrição pode conter entidades HTML, tratadas por regex.
 * - A imagem e créditos são carregados de forma independente, cada qual com
 *   seu próprio estado de loading e error.
 * - Caso o link não seja informado, as requisições são ignoradas.
 */

import { ChevronLeftIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import { useState, useEffect } from "react";

/**
 * @component EventPage
 * @description
 * Componente da página "Event".
 * Exibe informações sobre o evento astronomico escolhido.
 * 
 * @returns {JSX.Element} Estrutura visual completa da página Events.
 */
function EventPage() {
  const navigate = useNavigate();

  /**
   * Mapa de entidades HTML para caracteres especiais.
   * Utilizado para substituir entidades na descrição do evento.
   * @constant
   * @type {Object.<string, string>}
   */
  const mapa = {
    "&deg;": "°",
    "&#39;": "'",
    "&ndash": "-",
  };

  /**
   * Expressão regular gerada a partir das chaves do mapa de conversão.
   * Usada para substituir entidades HTML encontradas na descrição.
   * @type {RegExp}
   */
  const regex = new RegExp(Object.keys(mapa).join("|"), "g");

   /** @type {[URLSearchParams]} */
  const [searchParams] = useSearchParams();

  /**
   * Título bruto do evento recebido pela URL.
   * @type {string}
   */
  const title = searchParams.get("title") || "";

  /**
   * Descrição bruta do evento recebido pela URL.
   * @type {string}
   */
  const description = searchParams.get("description") || "";

  /**
   * Link para a página oficial do evento astronômico.
   * Utilizado para solicitar dados adicionais ao backend.
   * @type {string}
   */
  const link = searchParams.get("link") || "";

  /**
   * URL da imagem principal do evento obtida pela API.
   * @type {[string|null, Function]}
   */
  const [imageUrl, setImageUrl] = useState(null);

  /**
   * Texto alternativo ou descrição do ícone do evento.
   * @type {[string|null, Function]}
   */
  const [iconalt, setIconAlt] = useState(null);

  /**
   * Texto de créditos da imagem.
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
   * Efeito responsável por buscar a primeira imagem do evento.
   * Roda sempre que o `link` mudar.
   * Faz requisição POST para `/get_first_image`.
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
   * Efeito responsável por buscar o texto alternativo do ícone do evento.
   * Roda sempre que o `link` mudar.
   *
   * Faz requisição POST para `/get_icon`.
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
   * Efeito responsável por buscar os créditos da imagem.
   * Roda sempre que o `link` mudar.
   *
   * Faz requisição POST para `/get_credits`.
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
   * Processa o título bruto removendo prefixos antes dos ":".
   *
   * @function
   * @returns {string} Título tratado e legível.
   */
  const getProcessedTitle = () => {
    if (!title) return "Título não disponível";

    const parts = title.split(":");
    return parts.length > 1 ? parts[1].trim() : title;
  };

  /**
   * Processa e limpa a descrição do evento.
   * Remove artefatos HTML e recortes desnecessários.
   *
   * @function
   * @returns {string} Descrição tratada.
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
