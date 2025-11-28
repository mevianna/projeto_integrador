/**
 * @file index.jsx
 * @fileoverview Arquivo de inicialização principal do aplicativo React.
 * Responsável por configurar as rotas da aplicação e renderizar
 * a interface raiz dentro do DOM.
 *
 * @version 1.0.0
 * @date 2025-09-19
 * @lastmodified 2025-11-27
 *
 * @author
 * Beatriz Schulter Tartare <beastartare@gmail.com>
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires react Biblioteca base para construção de interfaces (StrictMode).
 * @requires react-dom/client Responsável pela renderização da aplicação no DOM (createRoot).
 * @requires react-router-dom Biblioteca de navegação utilizada para gerenciamento das rotas
 * (createBrowserRouter, RouterProvider).
 * @requires ./App.jsx Componente principal exibido na rota raiz (/).
 * @requires ./pages/eventpage.jsx Página que exibe a lista de eventos astronômicos.
 * @requires ./pages/aboutpage.jsx Página "About" descrevendo o projeto.
 * @requires ./pages/historypage.jsx Página com o histórico de previsões.
 * @requires ./pages/graphspage.jsx Página com gráficos históricos de temperatura e umidade.
 *
 * @description
 * Este arquivo define toda a estrutura de rotas da aplicação utilizando
 * `createBrowserRouter`, atribuindo a cada caminho um componente específico.
 * Em seguida, renderiza o aplicativo dentro do elemento `#root` usando
 * React 18 e seu modo estrito (StrictMode).
 *
 * A arquitetura de navegação permite que o usuário explore:
 * - A página inicial (App);
 * - A listagem de eventos astronômicos;
 * - O histórico de previsões meteorológicas;
 * - A página "About";
 * - Os gráficos meteorológicos históricos.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EventsPage from "./pages/eventpage.jsx";
import AboutPage from "./pages/aboutpage.jsx";
import HistoryPage from "./pages/historypage.jsx";
import GraphPages from "./pages/graphspage.jsx";

/**
 * @constant router
 * @type {import("react-router-dom").Router}
 * @description
 * Define a estrutura de rotas da aplicação utilizando `createBrowserRouter`.
 * Cada rota corresponde a uma página específica, que é renderizada quando
 * o usuário navega para seu respectivo caminho.
 *
 * ### Rotas definidas
 * - `/`: Renderiza o componente **App**, página inicial.
 * - `/events`: Renderiza **EventsPage**, com lista de eventos astronômicos.
 * - `/history`: Renderiza **HistoryPage**, exibindo o histórico de previsões.
 * - `/about`: Renderiza **AboutPage**, contendo informações sobre o projeto.
 * - `/history/graphs`: Renderiza **GraphPages**, exibindo gráficos históricos.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/events",
    element: <EventsPage />,
  },

  {
    path: "/history",
    element: <HistoryPage />,
  },

  {
    path: "/about",
    element: <AboutPage />,
  },

  {
    path: "/history/graphs",
    element: <GraphPages />,
  },
]);

/**
 * Renderiza a aplicação React no elemento `#root` do DOM.
 * @function render
 * @description
 * Inicializa o React 18 utilizando `createRoot` e envolve toda a aplicação
 * em `<StrictMode>`, garantindo avisos de práticas inseguras e verificações
 * adicionais durante o desenvolvimento.
 * O componente `RouterProvider` injeta o sistema de navegação definido pelo
 * objeto `router`, permitindo navegação entre páginas sem recarregar o site.
 *
 * @returns {void} 
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
