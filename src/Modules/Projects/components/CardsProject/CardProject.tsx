// src/Modules/Projects/components/CardsProject/CardProject.tsx
import React from "react";
import type { Project } from "../../Models/Project";
import g28 from "../../../Auth/Assets/g28.png";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { projectRoute, viewProjectRoute } from "../../Routes/ProjectsRoutes";

type Props = { project: Project; onDetails?: (id: number) => void; className?: string; };

const formatDate = (d: unknown) => {
  if (!d) return "-";
  const dt = new Date(d as any);
  return Number.isFinite(dt.getTime()) ? dt.toLocaleDateString() : "-";
};

const CardProject: React.FC<Props> = ({ project, onDetails, className }) => {

  const navigate = useNavigate({ from: projectRoute.id });

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
          break-words [overflow-wrap:anywhere] overflow-hidden line-clamp-3
        ">
          <p className="text-sm text-gray-500">Descripción:</p>
          {project.Description}
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
          className="text-base text-white px-3 py-1.5 border bg-[#091540] hover:bg-[#1789FC]"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default CardProject;
