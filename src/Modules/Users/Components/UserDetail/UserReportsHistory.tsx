import { Calendar, MapPin, FileText, ClipboardList } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Skeleton } from "@/Components/ui/skeleton";
import { useGetReportsByUser } from "../../../Reports/Hooks/ReportsHooks";
import type { ReportStateValue } from "../../../Reports/Models/Report";

type Props = {
  userId: number;
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStateBadgeVariant(
  state?: ReportStateValue
): "default" | "secondary" | "outline" {
  if (!state) return "outline";
  if (state === "Resuelto") return "default";
  if (state === "En Proceso") return "secondary";
  return "outline";
}


const UserReportsHistory = ({ userId }: Props) => {
  const { reports, isLoading } = useGetReportsByUser(userId);

  /* ── contadores de estado ── */
  const total = reports?.length ?? 0;
  const pendiente = reports?.filter((r) => r.ReportState === "Pendiente").length ?? 0;
  const enProceso = reports?.filter((r) => r.ReportState === "En Proceso").length ?? 0;
  const resuelto = reports?.filter((r) => r.ReportState === "Resuelto").length ?? 0;

  /* ── loading ── */
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <Separator />
        <CardContent className="space-y-3 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <ClipboardList className="h-4 w-4" />
            Historial de reportes
            {total > 0 && (
              <Badge variant="secondary" className="ml-1 font-normal">
                {total}
              </Badge>
            )}
          </CardTitle>

          {/* Resumen de estados */}
          {total > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">Pendiente</span>
                <span className="font-semibold text-foreground">{pendiente}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">En proceso</span>
                <span className="font-semibold text-foreground">{enProceso}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Resuelto</span>
                <span className="font-semibold text-foreground">{resuelto}</span>
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        {!reports || reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Este usuario no ha realizado reportes.</p>
          </div>
        ) : (
          <div className="space-y-0 divide-y">
            {reports.map((report) => (
              <div
                key={report.Id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-4 first:pt-0 last:pb-0"
              >
                {/* Estado + fecha */}
                <div className="flex shrink-0 flex-row items-center gap-2 sm:w-36 sm:flex-col sm:items-start sm:gap-1">
                  <Badge
                    variant={getStateBadgeVariant(report.ReportState)}
                    className="text-xs"
                  >
                    {report.ReportState ?? "—"}
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(report.CreatedAt)}
                  </span>
                </div>

                {/* Contenido principal */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-medium text-primary">
                      {report.Code}
                    </span>
                    {report.ReportType?.Name && (
                      <Badge variant="outline" className="text-[10px]">
                        {report.ReportType.Name}
                      </Badge>
                    )}
                  </div>

                  <p className="line-clamp-2 text-sm text-foreground">
                    {report.Description}
                  </p>

                  {(report.ExactLocation || report.ReportLocation?.Neighborhood) && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {[report.ReportLocation?.Neighborhood, report.ExactLocation]
                        .filter(Boolean)
                        .join(" — ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserReportsHistory;
