// src/Modules/Projects/components/CardsProject/CardProject.tsx
import React from "react";
import type { Project } from "../../Models/Project";
import { useNavigate } from "@tanstack/react-router";
import { projectRoute, viewProjectRoute } from "../../Routes/ProjectsRoutes";
import { CalendarDays, ImageOff, MapPin } from "lucide-react";
import ReportPhotoLightbox from "../../../Reports/Components/ReportPhotoLightbox";
import { getProjectStateBadgeClass } from "../../utils/projectStateTone";

type Props = { project: Project; onDetails?: (id: number) => void; className?: string; };

const formatDate = (d: unknown) => {
  if (!d) return "-";
  const dt = new Date(d as any);
  return Number.isFinite(dt.getTime()) ? dt.toLocaleDateString() : "-";
};

const CardProject: React.FC<Props> = ({ project, className }) => {
  const navigate = useNavigate({ from: projectRoute.id });
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
      <section className="flex grow flex-col border border-gray-200 border-t-0 bg-white p-5">
        <header className="min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Proyecto
              </p>
              <h3
                className="mt-1 text-lg font-semibold leading-7 text-slate-950 break-words [overflow-wrap:anywhere] line-clamp-2"
                title={project.Name}
              >
                {project.Name}
              </h3>
            </div>
            <div
              className={`shrink-0 border px-3 py-1 text-[11px] font-semibold ${getProjectStateBadgeClass(
                project.ProjectState?.Name,
              )}`}
            >
              {project.ProjectState?.Name ?? "Sin estado"}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
            <p className="line-clamp-2 break-words [overflow-wrap:anywhere]">
              {project.Location || "Sin ubicación registrada"}
            </p>
          </div>
        </header>

        <div className="my-4 border-t border-slate-100" />

        <div className="flex-grow overflow-hidden">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Descripción
          </p>
          <h3
            className="sr-only"
          />
          <div
            className="mt-2 text-sm text-slate-600 leading-relaxed [overflow-wrap:anywhere] line-clamp-4
              prose prose-sm max-w-none
              prose-p:my-0 prose-headings:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0
              prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-700"
            dangerouslySetInnerHTML={{ __html: project.Description ?? "" }}
          />
        </div>
      </section>


      {/* Footer fijo abajo */}
      <div className="mt-auto flex justify-end border-t border-slate-100 px-5 py-4">
        <button
          type="button"
          onClick={() =>
            navigate({
              to: viewProjectRoute.to,                 
              params: { projectId: String(project.Id) }
            })
          }
          className="border border-[#091540] px-3 py-1.5 text-sm font-medium text-[#091540] transition-colors hover:bg-slate-100"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default CardProject;
