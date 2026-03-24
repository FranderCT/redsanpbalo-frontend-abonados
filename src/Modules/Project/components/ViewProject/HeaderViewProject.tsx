import { useNavigate } from "@tanstack/react-router";
import { useReactToPrint } from "react-to-print";
import { Pencil, Printer, ChevronRight } from "lucide-react";
import { Button } from "../../../../Components/ui/button";
import { Badge } from "../../../../Components/ui/badge";
import type { Project } from "../../Models/Project";
import CreateProjectTraceModal from "../../../Project_Trace/Components/CreateProjectTraceModal";

type Props = {
  data: Project;
  printRef: React.RefObject<HTMLDivElement>;
};

export default function HeaderViewProject({ data, printRef }: Props) {
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Proyecto_${data.Name}`,
  });

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
        <span className="text-foreground font-medium truncate max-w-[240px]">
          {data.Name}
        </span>
      </nav>

      {/* Título + acciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight truncate">
            {data.Name}
          </h1>
          {data.ProjectState?.Name && (
            <Badge variant="secondary" className="shrink-0">
              {data.ProjectState.Name}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
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

          <Button variant="outline" size="sm" onClick={() => handlePrint()}>
            <Printer className="size-3.5 mr-1.5" />
            PDF
          </Button>

          <CreateProjectTraceModal ProjectId={data.Id} />
        </div>
      </div>
    </div>
  );
}
