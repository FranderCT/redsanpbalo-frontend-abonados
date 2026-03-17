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
import type { ReportListItem } from "../../Models/Report";
import { Calendar, FileText, MapPin, MessageSquare, User, Wrench } from "lucide-react";

type Props = {
  report: ReportListItem;
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
  const value = (state ?? "").toLowerCase();
  if (value.includes("resuelto")) return "default";
  if (value.includes("proceso")) return "secondary";
  if (value.includes("pendiente")) return "outline";
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

  return (
    <Dialog open={open} onOpenChange={(value) => !value && close()}>
      <DialogContent className="max-h-[70vh] w-full max-w-md gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-2 px-6 pt-6">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-xl">Reporte {report.Code}</DialogTitle>
            <Badge variant={getStatusVariant(report.ReportState)}>
              {report.ReportState ?? "—"}
            </Badge>
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
                  Direccion exacta
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
                  Descripcion
                </CardDescription>
                <p className="text-sm leading-relaxed text-foreground">
                  {report.Description}
                </p>
              </div>
            </CardContent>
          </Card>

          {report.ReportedBy && (
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="size-4" />
                  Reportado por
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium text-foreground">
                  {report.ReportedByDisplayName}
                </p>
                {report.ReportedBy.Email && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {report.ReportedBy.Email}
                  </p>
                )}
                {report.ReportedBy.PhoneNumber && (
                  <p className="text-sm text-muted-foreground">
                    {report.ReportedBy.PhoneNumber}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {report.AssignedPlumber && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wrench className="size-4" />
                  Encargado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium text-foreground">
                  {report.AssignedPlumber.FullName ?? report.AssignedPlumber.Name}
                </p>
                {report.AssignedPlumber.Email && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {report.AssignedPlumber.Email}
                  </p>
                )}
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
