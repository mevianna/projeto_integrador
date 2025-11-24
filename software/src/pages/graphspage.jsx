import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import Graphs from "../assets/components/graphs.jsx";

function GraphsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-around items-start p-10 w-screen h-screen overflow-y-auto">
        <div className="bg-purple-950 flex justify-center">
          <div className=" space-y-4 w-[400px] md:w-[900px] sm:w-[600px]">
            <div className="flex justify-center relative w-full">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-0 bottom-0 text-slate-100"
              >
                <ChevronLeftIcon />
              </button>
              <h1 className="text-slate-200 text-center text-xl font-bold mb-2">
                Graphs
              </h1>
            </div>
            <div>
              <Graphs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphsPage;
