import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Pencil, Printer, ChevronRight } from "lucide-react";
import { Button } from "../../../../Components/ui/button";
import { Badge } from "../../../../Components/ui/badge";
import type { Project } from "../../Models/Project";
import CreateProjectTraceModal from "../../../Project_Trace/Components/CreateProjectTraceModal";
import { downloadProjectPdf } from "../../Services/ProjectServices";

type Props = {
  data: Project;
};

export default function HeaderViewProject({ data }: Props) {
  const navigate = useNavigate();

  const handleDownloadPdf = async () => {
    try {
      const blob = await downloadProjectPdf(data.Id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = (data.Name ?? `proyecto-${data.Id}`)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

      link.href = url;
      link.download = `${safeName || `proyecto-${data.Id}`}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando PDF del proyecto", error);
      toast.error("No se pudo descargar el PDF del proyecto");
    }
  };

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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3">
          <h1 className="min-w-0 flex-1 text-2xl font-semibold tracking-tight truncate">
            {data.Name}
          </h1>
          {data.ProjectState?.Name && (
            <Badge variant="secondary" className="shrink-0 px-4 py-1">
              {data.ProjectState.Name}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
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

          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Printer className="size-3.5 mr-1.5" />
            PDF
          </Button>

          <CreateProjectTraceModal ProjectId={data.Id} />
        </div>
      </div>
    </div>
  );
}
