import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import type { Report } from "../../Models/Report";
import { Calendar, FileText, MapPin, MessageSquare, User, Wrench } from "lucide-react";

type Props = {
  report: Report;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusVariant(
  state?: string
): "default" | "secondary" | "destructive" | "outline" {
  const n = (state ?? "").toLowerCase();
  if (n.includes("resuelto") || n.includes("completado")) return "default";
  if (n.includes("proceso")) return "secondary";
  if (n.includes("pendiente") || n.includes("espera")) return "outline";
  if (n.includes("cancelado")) return "destructive";
  return "secondary";
}

export default function GetInfoReportModal({
  report,
  open,
  onClose,
  onSuccess,
}: Props) {
  const close = () => {
    onClose();
    onSuccess?.();
  };

  const assignments = report.Assignments ?? [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent className="max-h-[70vh] w-full max-w-md gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-2 px-6 pt-6">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-xl">Reporte {report.Code}</DialogTitle>
            <div className="flex flex-col gap-1 items-end">
              <Badge variant={getStatusVariant(report.State)}>
                {report.State ?? "—"}
              </Badge>
              {report.Urgency && (
                <Badge variant="outline" className="text-xs capitalize">
                  {report.Urgency}
                </Badge>
              )}
            </div>
          </div>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 shrink-0" />
            {formatDate(report.CreatedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                Detalles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div>
                <CardDescription className="mb-1 text-xs font-medium uppercase tracking-wider">
                  Tipo
                </CardDescription>
                <p className="text-sm text-foreground">
                  {report.ReportType?.Name ?? "—"}
                </p>
              </div>
              <Separator />
              <div>
                <CardDescription className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                  <MapPin className="size-3.5" />
                  Dirección exacta
                </CardDescription>
                <p className="text-base font-medium leading-snug text-foreground">
                  {report.ExactLocation}
                </p>
                {report.ReportLocation?.Neighborhood && (
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Barrio:</span>{" "}
                    {report.ReportLocation.Neighborhood}
                  </p>
                )}
              </div>
              <Separator />
              <div>
                <CardDescription className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                  <MessageSquare className="size-3.5" />
                  Descripción
                </CardDescription>
                <p className="text-sm leading-relaxed text-foreground">
                  {report.Description}
                </p>
              </div>
            </CardContent>
          </Card>

          {report.User && (
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="size-4" />
                  Reportado por
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium text-foreground">
                  {report.User.Name} {report.User.Surname1}
                  {report.User.Surname2 ? ` ${report.User.Surname2}` : ""}
                </p>
                {report.User.Email && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {report.User.Email}
                  </p>
                )}
                {report.User.PhoneNumber && (
                  <p className="text-sm text-muted-foreground">
                    {report.User.PhoneNumber}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {assignments.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wrench className="size-4" />
                  Encargados
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {assignments.map((a) => (
                  <div key={a.Id} className="rounded-md border bg-muted/30 p-2">
                    <p className="font-medium text-foreground">
                      {a.User
                        ? `${a.User.Name} ${a.User.Surname1}`
                        : "—"}
                    </p>
                    {a.User?.Email && (
                      <p className="text-xs text-muted-foreground">
                        {a.User.Email}
                      </p>
                    )}
                    {a.Instructions && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.Instructions}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {report.AdditionalInfo && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Información adicional
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                  {report.AdditionalInfo}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="ghost" onClick={close} className="w-full">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
