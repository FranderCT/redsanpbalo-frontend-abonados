// src/Modules/Projects/Pages/ViewProject.tsx
import { useMemo } from "react";
import { viewProjectRoute } from "../Routes/ProjectsRoutes";
import { useGetProjectById } from "../Hooks/ProjectHooks";

import HeaderViewProject from "../components/ViewProject/HeaderViewProject";
import DetailsProjectContainer from "../components/ViewProject/DetailsProjectContainer";


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
    <div className="p-6 space-y-2 text-[#091540] h-full flex flex-col justify-center items-center">
      <HeaderViewProject data={project}/>
      <DetailsProjectContainer data={project} />
    </div>
  );
};

export default ViewProject;
