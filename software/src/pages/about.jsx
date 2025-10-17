import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex justify-center relative overflow-x-hidden p-4 sm:p-6 md:p-8">
      <StarsBackground />

      <div className=" w-full max-w-5xl mx-auto flex flex-col mt-6 relative overflow-y-hidden z-10">
        <div className="p-6 sm:p-8 flex flex-col items-center space-y-8">
          <div className="flex justify-center relative w-full">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-slate-100 hover:text-slate-300 transition"
            >
              <ChevronLeftIcon size={28} />
            </button>
            <h1 className="text-slate-200 text-2xl sm:text-3xl font-bold text-center">
              About
            </h1>
          </div>

          {/* Texto principal */}
          <div className="bg-purple-950 rounded-2xl p-6 sm:p-10 space-y-8 w-full">
            <p className="text-slate-300 text-justify text-base sm:text-lg font-semibold">
              Este projeto é uma iniciativa desenvolvida como trabalho
              integrador do nosso curso de graduação. Ele representa a aplicação
              prática dos conhecimentos acadêmicos em uma solução
              interdisciplinar que combina diferentes áreas da tecnologia.
            </p>

            <p className="text-slate-300 text-justify text-base sm:text-lg font-semibold">
              A proposta consiste em integrar APIs de dados astronômicos com uma
              estação meteorológica própria e técnicas de machine learning para
              criar um sistema de previsão de condições ideais para observação
              celeste. O objetivo central é unir teoria e prática, abordando um
              desafio real através da convergência entre software, hardware e
              análise de dados.
            </p>

            <p className="text-slate-300 text-justify text-base sm:text-lg font-semibold">
              Mais do que um produto final, o trabalho simboliza nosso esforço
              acadêmico para consolidar aprendizados, promover a inovação e
              explorar as possibilidades da tecnologia na solução de problemas
              complexos e inspiradores.
            </p>

            <div className="flex flex-wrap justify-center relative mt-10">
              <img
                className="object-cover h-[430px] w-auto"
                src="astrodivas"
                alt="Equipe Astrodivas"
              />
              <a
                href="https://github.com/beastartare"
                className="absolute left-[250px] top-[500px] w-[150px] h-[350px]"
                title="Beatriz"
              ></a>
              <a
                href="https://github.com/mevianna"
                className="absolute left-[390px] top-[500px] w-[120px] h-[350px]"
                title="Maria Eduarda"
              ></a>
              <a
                href="https://github.com/rafasavaris"
                className="absolute left-[500px] top-[500px] w-[150px] h-[350px]"
                title="Rafaela"
              ></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
