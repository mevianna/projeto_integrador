import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";
import HistoryTable from "../assets/components/history.jsx";

function Historypage() {
  const navigate = useNavigate();

  function ViewGraphs() {
    navigate("/history/graphs");
  }
  
  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-around items-start p-10 w-screen h-screen">
        <div className="bg-purple-950 flex justify-center">
          <div className=" space-y-4 w-[900px]">
            <div className="flex justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-0 bottom-0 text-slate-100"
              >
                <ChevronLeftIcon />
              </button>
              <h1 className=" text-slate-200 text-center text-xl font-bold mb-2">
                History
              </h1>
              <div className="justify-end flex gap-3 mt-3">
                <button
                  onClick={ViewGraphs} // redireciona para graficos
                  className="px-3 py-1 absolute right-0 top-0 bottom-0 text-sm text-slate-200 bg-purple-600 hover:bg-purple-700 rounded-lg">
                  View Graphs
                </button>
              </div>
            </div>
            <div>
              <HistoryTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historypage;