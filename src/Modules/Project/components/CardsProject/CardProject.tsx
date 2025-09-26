// src/Modules/Projects/components/CardsProject/CardProject.tsx
import React from "react";
import type { Project } from "../../Models/Project";
import g28 from "../../../Auth/Assets/g28.png";
import { useNavigate } from "@tanstack/react-router";
import { projectRoute, viewProjectRoute } from "../../Routes/ProjectsRoutes";

type Props = { project: Project; onDetails?: (id: number) => void; className?: string; };

const formatDate = (d: unknown) => {
  if (!d) return "-";
  const dt = new Date(d as any);
  return Number.isFinite(dt.getTime()) ? dt.toLocaleDateString() : "-";
};

const CardProject: React.FC<Props> = ({ project, className }) => {

  const navigate = useNavigate({ from: projectRoute.id });
  const stateColors: Record<string, string> = {
  "Pendiente": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "En Proceso": "bg-blue-100 text-blue-800 border-blue-300",
  "Aprobado": "bg-green-100 text-green-800 border-green-300",
  "Denegado": "bg-red-100 text-red-800 border-red-300",
  };
  return (
    <div
      className={[
        "h-full flex flex-col border border-gray-200 shadow-xl bg-white p-2",
        className ?? "",
      ].join(" ")}
    >
      {/* Contenido del card: ocupa todo y empuja el footer */}
      <section className="flex grow flex-col border border-gray-200 bg-white gap-6 p-4">
        {/* Fecha */}
        <div className="text-sm inline-block px-2 py-1 border border-gray-200 bg-white text-gray-500 w-fit">
          {formatDate(project.InnitialDate)}
        </div>

        {/* Título */}
        <header className="w-full">
          <p className="text-sm text-gray-500">Proyecto:</p>
          <h3 className="text-lg font-semibold leading-snug">{project.Name}</h3>
        </header>

        {/* Descripción */}
        <div className="
          w-full max-w-full text-xs text-gray-600 leading-relaxed
          [overflow-wrap:anywhere] overflow-hidden line-clamp-3
        ">
          <p className="text-sm text-gray-500">Descripción:</p>
          {project.Description}
        </div>

        <div
          className={`text-xs px-3 py-1 border w-fit font-bold
            ${stateColors[project.ProjectState?.Name] ?? "bg-gray-100 text-gray-600 border-gray-300"}`}
        >
          {project.ProjectState?.Name ?? "Sin estado"}
        </div>
      </section>

      {/* Footer fijo abajo */}
      <div className="mt-auto flex justify-between pt-3 pb-3">
        <img src={g28} alt="Logo ASADA" className="w-10 h-10 object-contain" />
        <button
          type="button"
          onClick={() =>
            navigate({
              to: viewProjectRoute.to,                 
              params: { projectId: String(project.Id) }
            })
          }
          className="text-base text-[#091540] px-3 py-1.5 border border-[#091540] hover:bg-gray-200"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default CardProject;
