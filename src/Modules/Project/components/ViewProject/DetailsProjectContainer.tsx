import { useRef } from "react";
import type { Project } from "../../Models/Project";
import {
  useGetProjectTracesByProjectId,
  useGetTotalActualExpenseByProjectId,
} from "../../../Project_Trace/Hooks/ProjectTraceHooks";
import { Separator } from "../../../../Components/ui/separator";

import HeaderViewProject from "./HeaderViewProject";
import ProjectInfoSection from "./sections/ProjectInfoSection";
import ProjectRichSection from "./sections/ProjectRichSection";
import ProjectProjectionSection from "./sections/ProjectProjectionSection";
import ProjectExpenseSection from "./sections/ProjectExpenseSection";
import ProjectTracesSection from "./sections/ProjectTracesSection";
import ProjectDocumentsSection from "./sections/ProjectDocumentsSection";

type Props = { data: Project };

export default function DetailsProjectContainer({ data }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const { projectTraces: fetchedTraces, isLoading: tracesLoading } =
    useGetProjectTracesByProjectId(data?.Id);

  const { totalActualExpense: fetchedTotal, isLoading: totalExpenseLoading } =
    useGetTotalActualExpenseByProjectId(data?.Id);

  const tracesToRender =
    data.TraceProject && data.TraceProject.length > 0
      ? data.TraceProject
      : (fetchedTraces ?? []);

  const tracesFiltered = tracesToRender.filter((t: any) => {
    const pid =
      t?.Project?.Id ??
      t?.ProjectId ??
      t?.projectId ??
      t?.Project?.projectId ??
      null;

    return pid == null || Number(pid) === Number(data.Id);
  });

  const totalToRender = data.TotalActualExpense ?? fetchedTotal ?? null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-16 lg:px-0">
      {/* Header — no se imprime */}
      <HeaderViewProject data={data} />

      <Separator className="my-5 print:hidden" />

      {/* Contenido imprimible */}
      <div ref={printRef} className="space-y-4">
        <ProjectInfoSection data={data} />
        <ProjectRichSection data={data} />
        <ProjectProjectionSection data={data} />
        <ProjectExpenseSection
          data={data}
          totalToRender={totalToRender}
          isLoading={totalExpenseLoading}
        />
        <ProjectTracesSection
          traces={tracesFiltered}
          isLoading={tracesLoading}
        />
      </div>

      {/* Documentos — fuera del área imprimible */}
      <div className="mt-4">
        <ProjectDocumentsSection projectId={data.Id} />
      </div>
    </div>
  );
}
