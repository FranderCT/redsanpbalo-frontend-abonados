// src/Modules/Projects/components/CardsProject/CardProject.tsx
import React from "react";
import type { Project } from "../../Models/Project";
import { useNavigate } from "@tanstack/react-router";
import { projectRoute, viewProjectRoute } from "../../Routes/ProjectsRoutes";
import { CalendarDays, ImageOff } from "lucide-react";
import ReportPhotoLightbox from "../../../Reports/Components/ReportPhotoLightbox";

type Props = { project: Project; onDetails?: (id: number) => void; className?: string; };

const formatDate = (d: unknown) => {
  if (!d) return "-";
  const dt = new Date(d as any);
  return Number.isFinite(dt.getTime()) ? dt.toLocaleDateString() : "-";
};

const CardProject: React.FC<Props> = ({ project, className }) => {

  const navigate = useNavigate({ from: projectRoute.id });
  const stateColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "en proceso": "bg-blue-100 text-blue-800 border-blue-300",
  aprobado: "bg-green-100 text-green-800 border-green-300",
  denegado: "bg-red-100 text-red-800 border-red-300",
  };
  return (
    <div
      className={[
        "h-full flex flex-col overflow-hidden border border-gray-200 shadow-xl bg-white",
        className ?? "",
      ].join(" ")}
    >
      <div className="relative border-b border-gray-200 bg-slate-100">
        {project.CoverImageUrl ? (
          <ReportPhotoLightbox
            src={project.CoverImageUrl}
            alt={`Portada del proyecto ${project.Name}`}
            thumbnailClass="h-64 rounded-none border-0"
          />
        ) : (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 text-slate-500">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/80 shadow-sm">
              <ImageOff className="size-6" />
            </div>
            <p className="text-sm font-medium">Sin foto de portada</p>
          </div>
        )}

        <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          <CalendarDays className="size-3.5" />
          {formatDate(project.InnitialDate)}
        </div>
      </div>

      {/* Contenido del card: ocupa todo y empuja el footer */}
      <section className="flex grow flex-col  border border-gray-200 border-t-0 bg-white p-4">

        {/* Título */}
        <header className="w-full min-w-0">
          <p className="text-sm text-gray-500">Proyecto</p>
          <h3
            className="min-h-[1.75rem] text-lg font-semibold leading-7 line-clamp-1 break-words"
            title={project.Name}
          >
            {project.Name}
          </h3>
        </header>

        {/* Descripción (flex-grow) */}
        <div
          className="flex-grow overflow-hidden"
        >
          <p className="text-sm text-gray-500">Descripción</p>
          <div
            className="mt-1 text-xs text-gray-600 leading-relaxed [overflow-wrap:anywhere] line-clamp-3
              prose prose-sm max-w-none
              prose-p:my-0 prose-headings:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0
              prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-700"
            dangerouslySetInnerHTML={{ __html: project.Description ?? "" }}
          />
        </div>

        {/* Estado (badge fijo al final del section) */}
        <div
          className={`text-xs px-3 py-1 border w-fit font-bold
            ${
              stateColors[
                (project.ProjectState?.Name ?? "")
                  .toString()
                  .trim()
                  .toLowerCase()
              ] ?? "bg-gray-100 text-gray-600 border-gray-300"
            }`}
        >
          {project.ProjectState?.Name ?? "Sin estado"}
        </div>
      </section>


      {/* Footer fijo abajo */}
      <div className="mt-auto flex justify-end px-4 pb-4 pt-3">
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
