import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full min-h-screen flex justify-center gap-4 p-4 relative overflow-x-hidden">
      <StarsBackground />
      <div className="inset-0 sm:p-6 md:p-8 p-4 relative z-10 flex flex-col items-center space-y-6 w-full max-w-5xl">
        <div className=" bg-purple-950 flex justify-center p-10">
          <div className=" space-y-4 w-[800px]">
            <div className="flex justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-0 bottom-0 text-slate-100"
              >
                <ChevronLeftIcon />
              </button>
              <h1 className=" text-slate-200 text-center text-3xl font-bold mb-2">
                About
              </h1>
            </div>
            <div className="space-y-11 space-x-6">
              <div>
                <p className=" text-slate-300 text-justify text-lg font-semibold  mb-2">
                  Este projeto é uma iniciativa desenvolvida como trabalho
                  integrador do nosso curso de graduação. Ele representa a
                  aplicação prática dos conhecimentos acadêmicos em uma solução
                  interdisciplinar que combina diferentes áreas da tecnologia.
                </p>
                <p className=" text-slate-300 text-justify text-lg font-semibold  mb-2">
                  A proposta consiste em integrar APIs de dados astronômicos com
                  uma estação meteorológica própria e técnicas de machine
                  learning para criar um sistema de previsão de condições ideais
                  para observação celeste. O objetivo central é unir teoria e
                  prática, addressando um desafio real através da convergência
                  entre software, hardware e análise de dados.
                </p>

                <p className=" text-slate-300 text-justify text-lg font-semibold  mb-2">
                  Mais do que um produto final, o trabalho simboliza nosso
                  esforço acadêmico para consolidar aprendizados, promover a
                  inovação e explorar as possibilidades da tecnologia na solução
                  de problemas complexos e inspiradores.
                </p>
              </div>
              <div className="flex flex-wrap space-x-20 justify-center">
                <img
                  className="object-cover h-[430px] w-auto"
                  src="astrodivas"
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
