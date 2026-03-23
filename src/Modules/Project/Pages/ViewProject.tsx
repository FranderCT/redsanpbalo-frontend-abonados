import { useMemo } from "react";
import { viewProjectRoute } from "../Routes/ProjectsRoutes";
import { useGetProjectById } from "../Hooks/ProjectHooks";
import type { Project } from "../Models/Project";
import DetailsProjectContainer from "../components/ViewProject/DetailsProjectContainer";

const ViewProject = ({ initialProject }: { initialProject?: Project }) => {
  const { projectId } = viewProjectRoute.useParams();
  const id = useMemo(() => Number(projectId), [projectId]);

  const { project, isPending, error } = useGetProjectById(
    initialProject ? undefined : Number.isFinite(id) && id > 0 ? id : undefined
  );

  const projectToUse: Project | undefined = initialProject ?? project;

  if (!initialProject) {
    if (!Number.isFinite(id) || id <= 0)
      return (
        <div className="flex items-center justify-center h-full p-12">
          <p className="text-sm text-muted-foreground">ID de proyecto inválido.</p>
        </div>
      );
    if (isPending)
      return (
        <div className="flex items-center justify-center h-full p-12">
          <p className="text-sm text-muted-foreground">Cargando proyecto…</p>
        </div>
      );
    if (error)
      return (
        <div className="flex items-center justify-center h-full p-12">
          <p className="text-sm text-destructive">Error al cargar el proyecto.</p>
        </div>
      );
    if (!projectToUse)
      return (
        <div className="flex items-center justify-center h-full p-12">
          <p className="text-sm text-muted-foreground">No se encontró el proyecto.</p>
        </div>
      );
  }

  if (!projectToUse)
    return (
      <div className="flex items-center justify-center h-full p-12">
        <p className="text-sm text-muted-foreground">No hay datos del proyecto.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <DetailsProjectContainer data={projectToUse} />
    </div>
  );
};

export default ViewProject;
