import React from "react";

function Visibility() {
  let data = new Date();

  return (
    <div className="p-4 bg-purple-800 rounded-2xl shadow-md text-slate-200 hover:shadow-lg transition">
      <h1 className="text-lg font-bold mb-2">
        {" "}
        {data.toString().slice(0, 15)}
      </h1>
      /*aqui temos que chamar alguma função que verifica a nossa saida (nível de
      visilibidade) e associar a uma imagem*/
    </div>
  );
}

export default Visibility;
