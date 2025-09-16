// src/Modules/Projects/Pages/ViewProject.tsx
import { useMemo } from "react";
import { viewProjectRoute } from "../Routes/ProjectsRoutes";
import { useGetProjectById } from "../Hooks/ProjectHooks";


const ViewProject = () => {
  // obtenemos el parámetro desde la ruta $projectId
  const { projectId } = viewProjectRoute.useParams(); // <- string
  const id = useMemo(() => Number(projectId), [projectId]);

  const { project, isPending, error } = useGetProjectById(
    Number.isFinite(id) && id > 0 ? id : undefined
  );

  if (!Number.isFinite(id) || id <= 0) {
    return <p className="p-6 text-red-600">ID de proyecto inválido.</p>;
  }
  if (isPending) return <p className="p-6">Cargando proyecto...</p>;
  if (error) return <p className="p-6 text-red-600">Error al cargar el proyecto.</p>;
  if (!project) return <p className="p-6">No se encontró el proyecto.</p>;

  return (
    <div className="p-6 space-y-2 text-[#091540] border w-full h-full">
      <h2 className="text-2xl font-bold mb-4">{project.Name}</h2>
      <p><b>Ubicación:</b> {project.Location}</p>
      <p><b>Objetivo:</b> {project.Objective}</p>
      <p><b>Descripción:</b> {project.Description}</p>
      <p><b>Observación:</b> {project.Observation}</p>
      <p><b>Inicio:</b> {project.InnitialDate ? new Date(project.InnitialDate).toLocaleDateString() : "-"}</p>
      <p><b>Fin:</b> {project.EndDate ? new Date(project.EndDate).toLocaleDateString() : "-"}</p>
      {project.SpaceOfDocument && (
        <p><b>Espacio de documento:</b> {project.SpaceOfDocument}</p>
      )}
    </div>
  );
};

export default ViewProject;
