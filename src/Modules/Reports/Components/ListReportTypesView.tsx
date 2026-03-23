import { useGetAllReportTypes } from "../Hooks/ReportTypesHooks";
import ReportTypeCard from "./ReportTypeCard";

export default function ListReportTypesView() {
  const { reportTypes, isLoading, isError, error, refetch } =
    useGetAllReportTypes();

  const items = reportTypes ?? [];

  if (isError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border bg-muted/20 p-8">
        <p className="text-center text-destructive">
          {error?.message ?? "Error al cargar los tipos de reporte."}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        Cargando tipos de reporte…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#091540]/70 mb-2">
            No hay tipos de reporte registrados.
          </p>
          <p className="text-sm text-[#091540]/50">
            Cree un tipo para usarlo en los reportes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-[#091540] mb-4">
          Tipos de reporte
        </h2>
        <div className="flex flex-wrap gap-4">
          {items.map((type) => (
            <ReportTypeCard
              key={type.Id}
              reportType={type}
              onDeleteSuccess={() => refetch()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
