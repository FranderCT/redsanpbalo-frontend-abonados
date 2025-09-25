// src/Modules/Projects/components/ProjectsGrid.tsx
import React from "react";
import type { Project } from "../../Models/Project";
import CardProject from "./CardProject";

type Props = {
  projects: Project[];
  onDetails?: (id: number) => void;
  emptyText?: string;
};

export const ProjectsGrid: React.FC<Props> = ({ projects, onDetails, emptyText }) => {
  if (!projects?.length) {
    return (
      <div className="text-center text-sm text-gray-500 py-12">
        {emptyText ?? "No hay proyectos para mostrar."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr items-stretch">
        {projects.map(p => (
            <CardProject key={p.Id} project={p} className="h-full" onDetails={onDetails} />
        ))}
    </div>
  );
};

export default ProjectsGrid;
