import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MapPin,
  MessageSquare,
  Pencil,
  User,
  Wrench,
  Clock,
  Hash,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import type { ReportListItem, ReportStateValue } from "../../Models/Report";
import ReportPhotoLightbox from "../ReportPhotoLightbox";
import EditReportModal from "../Modals/EditReportModal";

type Props = {
  report: ReportListItem;
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusVariant(
  state?: ReportStateValue | string,
): "default" | "secondary" | "destructive" | "outline" {
  const value = (state ?? "").toLowerCase();
  if (value.includes("resuelto")) return "default";
  if (value.includes("proceso")) return "secondary";
  if (value.includes("pendiente")) return "outline";
  return "secondary";
}

const ReportDetailCard = ({ report }: Props) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/reports"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Editar
        </Button>
      </div>

      {/* Hero card */}
      <Card className="overflow-hidden">
        <div className="h-14" />
        <CardContent className="px-4 pb-5 pt-0 sm:px-6">
          <div className="-mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            {/* Icon + code */}
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary/10 shadow-sm sm:h-16 sm:w-16">
                <FileText className="h-5 w-5 text-primary sm:h-7 sm:w-7" />
              </div>
              <div className="pb-0.5 sm:pb-1">
                <h1 className="text-lg font-bold leading-tight text-foreground sm:text-xl">
                  Reporte {report.Code}
                </h1>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {report.DisplayLocation}
                </p>
              </div>
            </div>

            {/* Estado + ID + fecha */}
            <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end sm:pb-1">
              <Badge variant={getStatusVariant(report.ReportState)} className="text-xs">
                {report.ReportState ?? "—"}
              </Badge>
              <span className="text-xs text-muted-foreground">ID #{report.Id}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {formatDate(report.CreatedAt)}
          </div>
        </CardContent>
      </Card>

      {/* Foto del reporte */}
      {report.PhotoUrl && (
        <ReportPhotoLightbox src={report.PhotoUrl} thumbnailClass="h-64 rounded-xl" />
      )}

      {/* Info grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

        {/* Detalles */}
        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <FileText className="h-4 w-4" />
              Detalles del reporte
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Tipo</p>
                <p className="mt-0.5 text-sm font-medium">{report.ReportType?.Name ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Ubicación exacta</p>
                <p className="mt-0.5 text-sm font-medium">{report.ExactLocation || "—"}</p>
                {report.ReportLocation?.Neighborhood && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Barrio: {report.ReportLocation.Neighborhood}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Descripción</p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm font-medium">{report.Description || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reportado por */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <User className="h-4 w-4" />
              Reportado por
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            {report.ReportedBy ? (
              <>
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Nombre</p>
                    <p className="mt-0.5 text-sm font-medium">{report.ReportedByDisplayName || "—"}</p>
                  </div>
                </div>
                {report.ReportedBy.Email && (
                  <div className="flex items-start gap-3">
                    <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Correo</p>
                      <p className="mt-0.5 truncate text-sm font-medium">{report.ReportedBy.Email}</p>
                    </div>
                  </div>
                )}
                {report.ReportedBy.PhoneNumber && (
                  <div className="flex items-start gap-3">
                    <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Teléfono</p>
                      <p className="mt-0.5 text-sm font-medium">{report.ReportedBy.PhoneNumber}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sin información</p>
            )}
          </CardContent>
        </Card>

        {/* Fontanero asignado */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Wrench className="h-4 w-4" />
              Fontanero asignado
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            {report.AssignedPlumber ? (
              <>
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Nombre</p>
                    <p className="mt-0.5 text-sm font-medium">
                      {report.AssignedPlumber.FullName ?? report.AssignedPlumber.Name}
                    </p>
                  </div>
                </div>
                {report.AssignedPlumber.Email && (
                  <div className="flex items-start gap-3">
                    <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Correo</p>
                      <p className="mt-0.5 truncate text-sm font-medium">{report.AssignedPlumber.Email}</p>
                    </div>
                  </div>
                )}
                {report.Instructions && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Instrucciones</p>
                      <p className="mt-0.5 whitespace-pre-wrap text-sm font-medium">{report.Instructions}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sin fontanero asignado</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historial de estados */}
      {report.StateHistory && report.StateHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="h-4 w-4" />
              Historial de estados
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <ol className="space-y-4">
              {report.StateHistory.map((entry) => (
                <li key={entry.Id} className="flex gap-3">
                  <div className="mt-1 flex h-2 w-2 shrink-0 items-center justify-center">
                    <span className="block h-2 w-2 rounded-full bg-primary/60" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {entry.PreviousState && (
                        <>
                          <Badge variant={getStatusVariant(entry.PreviousState)} className="text-[10px]">
                            {entry.PreviousState}
                          </Badge>
                          <span className="text-xs text-muted-foreground">→</span>
                        </>
                      )}
                      <Badge variant={getStatusVariant(entry.NewState)} className="text-[10px]">
                        {entry.NewState}
                      </Badge>
                    </div>
                    {entry.ReasonChange && (
                      <p className="mt-1 text-xs text-muted-foreground">{entry.ReasonChange}</p>
                    )}
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                      {formatDate(entry.CreatedAt)}
                      {entry.ChangedBy && (
                        <> · {entry.ChangedBy.FullName ?? entry.ChangedBy.Name}</>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {editOpen && (
        <EditReportModal
          report={report}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
};

export default ReportDetailCard;
