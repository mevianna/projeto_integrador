/**
 * @file about.jsx
 * @fileoverview "About" page of the application, describing the project,
 * its purpose, technologies used, and team members.
 *
 * @version 1.0.0
 * @date 2025-09-19
 * @lastmodified 2025-11-26
 *
 * @author
 * Beatriz Schulter Tartare <beastartareufsc@gmail.com>
 * Rafaela Fernandes Savaris <savarisf.rafaela@gmail.com>
 *
 * @license Proprietary
 *
 * @requires lucide-react Library for SVG icons used in navigation (ChevronLeftIcon).
 * @requires react-router-dom Responsible for navigation between pages (useNavigate).
 * @requires ../assets/components/stars.jsx Visual component responsible for rendering the animated starry background.
 *
 * @description
 * "About" page responsible for presenting the overall context of the project
 * developed in the Integrated Project course of the Computer Engineering program – UFSC.
 * The page describes:
 * - The multidisciplinary goal of the project;
 * - The integration of astronomical APIs, an in-house weather station,
 *   and machine learning techniques for predicting observation conditions;
 * - The academic and practical motivation behind the development;
 * - A gallery containing the team members, with direct links to their
 *   GitHub profiles.
 *
 * The interface uses subtle animations and a thematic background (StarsBackground)
 * to reinforce the project’s visual identity and provide a more immersive
 * user experience.
 *
 * @remarks
 * - The clickable maps over the team image use absolute positioning;
 *   adjustments may be necessary on very small screens.
 */

import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarsBackground from "../assets/components/stars.jsx";

/**
 * @component AboutPage
 * @description
 * "About" page component.
 * Displays information about the project, its purpose, and the development team.
 *
 * @returns {JSX.Element} Complete visual structure of the About page.
 */

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

          <div className="bg-purple-950 rounded-2xl p-6 sm:p-10 space-y-8 w-full">
            <p className="text-slate-300 text-justify text-base sm:text-lg font-semibold">
              This project is an initiative developed as an integrative
              assignment for our undergraduate program. It represents the
              practical application of academic knowledge in an
              interdisciplinary solution that combines different areas of
              technology.
            </p>

            <p className="text-slate-300 text-justify text-base sm:text-lg font-semibold">
              The proposal consists of integrating astronomical data APIs with
              our own weather station and machine learning techniques to create
              a system capable of predicting ideal conditions for celestial
              observation. The central objective is to bridge theory and
              practice by addressing a real-world challenge through the
              convergence of software, hardware, and data analysis.
            </p>

            <p className="text-slate-300 text-justify text-base sm:text-lg font-semibold">
              More than a final product, this work symbolizes our academic
              effort to consolidate learning, foster innovation, and explore the
              possibilities of technology in solving complex and inspiring
              problems.
            </p>

            <div className="flex flex-wrap justify-center relative mt-10">
              <img
                className="object-cover sm:h-[400px]  md:h-[600px] h-[300px] w-auto"
                src="astrodivos.png"
                alt="Equipe Astrodivas"
              />
              <a
                href="https://github.com/beastartare"
                className="absolute left-[250px] top-[100px] w-[150px] h-[200px]"
                title="Beatriz"
              ></a>
              <a
                href="https://github.com/mevianna"
                className="absolute left-[390px] top-6 w-[120px] h-[150px]"
                title="Maria Eduarda"
              ></a>
              <a
                href="https://github.com/edumtk"
                className="absolute left-[390px] top-[200px] w-[150px] h-[350px]"
                title="Eduardo"
              ></a>
              <a
                href="https://github.com/rafasavaris"
                className="absolute left-[500px] top-[100px] w-[150px] h-[350px]"
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