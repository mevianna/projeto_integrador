import { ChevronLeftIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";

function InfoPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen relative">
      <StarsBackground />
      <div className="absolute inset-0 flex justify-around items-start p-10">
        <div className=" bg-purple-950 flex justify-center p-10">
          <h1 className=" text-slate-200 text-center text-3xl font-bold mb-2">
            History
          </h1>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
