// src/Modules/Projects/Pages/ViewProject.tsx
import { useMemo } from "react";
import { viewProjectRoute } from "../Routes/ProjectsRoutes";
import { useGetProjectById } from "../Hooks/ProjectHooks";
import type { Project } from "../Models/Project";

import HeaderViewProject from "../components/ViewProject/HeaderViewProject";
import DetailsProjectContainer from "../components/ViewProject/DetailsProjectContainer";

// Accept an optional full project via props to avoid refetching when we already
// have the object (e.g. when navigating from a paginated list and passing the
// project by props/state). If not provided, fallback to fetching by route id.
const ViewProject = ({ initialProject }: { initialProject?: Project } ) => {
  // obtenemos el parámetro desde la ruta $projectId
  const { projectId } = viewProjectRoute.useParams(); // <- string
  const id = useMemo(() => Number(projectId), [projectId]);

  // Fetch only when we don't have an initialProject passed in
  const { project, isPending, error } = useGetProjectById(
    initialProject ? undefined : (Number.isFinite(id) && id > 0 ? id : undefined)
  );

  // If an initial project was provided, use it directly
  const projectToUse: Project | undefined = initialProject ?? project;

  // If initialProject wasn't provided, validate route id and fetch state
  if (!initialProject) {
    if (!Number.isFinite(id) || id <= 0) {
      return <p className="p-6 text-red-600">ID de proyecto inválido.</p>;
    }
    if (isPending) return <p className="p-6">Cargando proyecto...</p>;
    if (error) return <p className="p-6 text-red-600">Error al cargar el proyecto.</p>;
    if (!projectToUse) return <p className="p-6">No se encontró el proyecto.</p>;
  }

  if (!projectToUse) {
    // Defensive fallback (shouldn't normally hit because of above checks)
    return <p className="p-6">No hay datos del proyecto.</p>;
  }

  return (
    <div className="p-6 space-y-2 text-[#091540] h-auto flex flex-col justify-center items-center">
      <HeaderViewProject data={projectToUse} />
      <DetailsProjectContainer data={projectToUse} />
    </div>
  );
};

export default ViewProject;
