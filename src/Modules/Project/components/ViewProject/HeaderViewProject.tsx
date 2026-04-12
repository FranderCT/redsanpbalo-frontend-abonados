import { useNavigate } from "@tanstack/react-router";
import { Pencil, Printer, ChevronRight } from "lucide-react";
import { Button } from "../../../../Components/ui/button";
import { Badge } from "../../../../Components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "../../Models/Project";
import CreateProjectTraceModal from "../../../Project_Trace/Components/CreateProjectTraceModal";
import { useDownloadProjectPdf } from "../../Hooks/ProjectHooks";
import { getProjectStateBadgeClass } from "../../utils/projectStateTone";

type Props = {
  data: Project;
};

export default function HeaderViewProject({ data }: Props) {
  const navigate = useNavigate();
  const downloadProjectPdf = useDownloadProjectPdf();

  return (
    <div className="print:hidden space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <button
          onClick={() => navigate({ to: "/dashboard/projects" })}
          className="hover:text-foreground transition-colors"
        >
          Proyectos
        </button>
        <ChevronRight className="size-3" />
        <span className="min-w-0 max-w-full font-medium text-foreground break-words [overflow-wrap:anywhere]">
          {data.Name}
        </span>
      </nav>

      {/* Título + acciones */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight break-words [overflow-wrap:anywhere]">
          {data.Name}
        </h1>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {data.ProjectState?.Name && (
              <Badge
                variant="outline"
                className={cn(
                  "px-4 py-1",
                  getProjectStateBadgeClass(data.ProjectState.Name),
                )}
              >
                {data.ProjectState.Name}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate({
                  to: "/dashboard/projects/$projectId/edit",
                  params: { projectId: String(data.Id) },
                })
              }
            >
              <Pencil className="size-3.5 mr-1.5" />
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadProjectPdf.mutate({ id: data.Id, name: data.Name })}
              disabled={downloadProjectPdf.isPending}
            >
              <Printer className="size-3.5 mr-1.5" />
              {downloadProjectPdf.isPending ? "Generando..." : "PDF"}
            </Button>

            <CreateProjectTraceModal ProjectId={data.Id} />
          </div>
        </div>
      </div>
    </div>
  );
}
