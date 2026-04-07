import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, MapPin, User, Wrench } from "lucide-react";
import ReportPhotoLightbox from "../Modules/Reports/Components/ReportPhotoLightbox";
import { appSocket, syncAppSocketAuth } from "./appSocket";
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
import { Separator } from "@/Components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { useAssignUserInCharge } from "../Modules/Reports/Hooks/ReportsHooks";
import {
  mapLiveEventToListItem,
  withAssignedPlumber,
} from "../Modules/Reports/adapters/reportAdapters";
import { useGetUsersByRoleFontanero } from "../Modules/Users/Hooks/UsersHooks";
import type {
  ReportListItem,
  ReportLiveEvent,
} from "../Modules/Reports/Models/Report";

export default function LiveReports() {
  const [, setReports] = useState<ReportListItem[]>(() => {
    const saved = localStorage.getItem("liveReports");
    return saved ? (JSON.parse(saved) as ReportListItem[]) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState<ReportListItem | null>(null);
  const [selectedFontanero, setSelectedFontanero] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const assignUserMutation = useAssignUserInCharge();
  const { fontaneros = [], isPending: fontanerosLoading } =
    useGetUsersByRoleFontanero();

  const handleAssignFontanero = async () => {
    if (!newReport || !selectedFontanero) {
      toast.error("Debes seleccionar un fontanero");
      return;
    }

    setIsAssigning(true);
    try {
      await assignUserMutation.mutateAsync({
        reportId: newReport.Id.toString(),
        plumberUserId: Number(selectedFontanero),
        instructions: "Asignado desde la alerta de reportes en tiempo real",
      });
      const assignedFontanero =
        fontaneros.find((item) => item.Id === Number(selectedFontanero)) ?? null;
      setNewReport(withAssignedPlumber(newReport, assignedFontanero));
      toast.success("Fontanero asignado exitosamente");
      setSelectedFontanero("");
    } catch (error) {
      toast.error("Error al asignar fontanero");
      console.error(error);
    } finally {
      setIsAssigning(false);
    }
  };

  useEffect(() => {
    syncAppSocketAuth();

    const handler = (payload: ReportLiveEvent) => {
      const report = mapLiveEventToListItem(payload);

      setNewReport(report);
      setShowModal(true);
      setReports((prev) => {
        const next = [report, ...prev.filter((item) => item.Id !== report.Id)];
        localStorage.setItem("liveReports", JSON.stringify(next));
        return next;
      });
    };

    appSocket.on("averia:nueva", handler);
    return () => {
      appSocket.off("averia:nueva", handler);
    };
  }, []);

  const isAssigned = !!newReport?.AssignedPlumber;

  return (
    <Dialog
      open={showModal}
      onOpenChange={(value) => {
        if (!value && isAssigned) setShowModal(false);
      }}
    >
      <DialogContent className="max-h-[80vh] w-full max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-destructive" />
            <DialogTitle>Nuevo reporte recibido</DialogTitle>
          </div>
          <DialogDescription>
            Se ha registrado un nuevo reporte en el sistema
          </DialogDescription>
        </DialogHeader>

        {newReport && (
          <div className="max-h-[calc(80vh-10rem)] overflow-y-auto">
            {/* Foto del reporte */}
            {newReport.PhotoUrl && (
              <div className="border-b px-6 pt-4 pb-2">
                <ReportPhotoLightbox src={newReport.PhotoUrl} thumbnailClass="h-44" />
              </div>
            )}

            <div className="space-y-4 px-6 py-4">
              {/* Datos del reporte */}
              <div className="rounded-lg border bg-destructive/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-foreground">
                    Reporte #{newReport.Id}
                  </p>
                  <Badge variant="destructive" className="text-xs">
                    {new Date(newReport.CreatedAt).toLocaleString("es-CR")}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {newReport.ReportLocation?.Neighborhood && (
                    <Badge variant="outline">
                      <MapPin className="mr-1 size-3" />
                      {newReport.ReportLocation.Neighborhood}
                    </Badge>
                  )}
                  {newReport.ReportType?.Name && (
                    <Badge variant="outline">{newReport.ReportType.Name}</Badge>
                  )}
                  {newReport.ReportState && (
                    <Badge variant="secondary">{newReport.ReportState}</Badge>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Ubicación
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {newReport.DisplayLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Descripción
                    </p>
                    <p className="text-sm text-foreground">
                      {newReport.Description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reportado por */}
              <div className="rounded-lg border p-4">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <User className="size-4" />
                  Reportado por
                </p>
                <p className="text-sm font-medium">{newReport.ReportedByDisplayName}</p>
                {newReport.ReportedBy?.Email && (
                  <p className="text-sm text-muted-foreground">
                    {newReport.ReportedBy.Email}
                  </p>
                )}
              </div>

              {/* Asignar fontanero */}
              <div className="rounded-lg border p-4">
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Wrench className="size-4" />
                  {isAssigned ? "Reasignar fontanero" : "Asignar fontanero"}
                </p>

                {isAssigned && (
                  <div className="mb-3 flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                    <CheckCircle2 className="size-4 shrink-0" />
                    Asignado a{" "}
                    <span className="font-medium">
                      {newReport.AssignedPlumber!.FullName ??
                        newReport.AssignedPlumber!.Name}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="fontanero-select" className="sr-only">
                      Seleccionar fontanero
                    </Label>
                    <Select
                      value={selectedFontanero}
                      onValueChange={setSelectedFontanero}
                      disabled={fontanerosLoading || isAssigning}
                    >
                      <SelectTrigger id="fontanero-select">
                        <SelectValue
                          placeholder={
                            fontanerosLoading
                              ? "Cargando fontaneros..."
                              : "Seleccionar fontanero"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {fontaneros.map((fontanero) => (
                          <SelectItem
                            key={fontanero.Id}
                            value={String(fontanero.Id)}
                          >
                            {fontanero.Name} {fontanero.Surname1}
                            {newReport.AssignedPlumber?.Id === fontanero.Id &&
                              " (Actual)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAssignFontanero}
                    disabled={
                      !selectedFontanero || isAssigning || fontanerosLoading
                    }
                  >
                    {isAssigning ? "Asignando..." : "Asignar"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t px-6 py-4">
          <div className="flex w-full items-center justify-between gap-3">
            {!isAssigned ? (
              <p className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                Debes asignar un fontanero para continuar
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="size-4 shrink-0" />
                Fontanero asignado correctamente
              </p>
            )}
            <Button
              onClick={() => setShowModal(false)}
              disabled={!isAssigned}
              className="shrink-0"
            >
              Entendido
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
