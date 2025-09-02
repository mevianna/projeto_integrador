import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";

function InfoPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-around items-start p-10">
        <div className=" bg-purple-950 flex justify-center p-10">
          <div className=" space-y-4 w-[900px]">
            <div className="flex justify-center relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-0 bottom-0 text-slate-100"
              >
                <ChevronLeftIcon />
              </button>
              <h1 className=" text-slate-200 text-center text-lg font-bold mb-2">
                History
              </h1>
            </div>
            <div className="space-y-4 bg-purple-800 p-6 rounded-md shadow"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
