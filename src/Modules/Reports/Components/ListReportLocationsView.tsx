import { useGetAllReportLocations } from "../Hooks/ReportLocationHooks";
import ReportLocationCard from "./ReportLocationCard";

/**
 * Vista de CRUD de ubicaciones (barrios) para reportes.
 * Se muestra dentro del módulo de reportes cuando el usuario elige "Ubicaciones".
 */
export default function ListReportLocationsView() {
  const { reportLocations, isLoading, isError, error, refetch } =
    useGetAllReportLocations();

  const items = reportLocations ?? [];

  if (isError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border bg-muted/20 p-8">
        <p className="text-center text-destructive">
          {error?.message ?? "Error al cargar las ubicaciones."}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        Cargando ubicaciones…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#091540]/70 mb-2">
            No hay ubicaciones registradas.
          </p>
          <p className="text-sm text-[#091540]/50">
            Cree una ubicación para usarla en los reportes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((loc) => (
        <ReportLocationCard
          key={loc.Id}
          reportLocation={loc}
          onDeleteSuccess={() => refetch()}
        />
      ))}
    </div>
  );
}
