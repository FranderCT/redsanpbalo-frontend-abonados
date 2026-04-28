import { useState } from "react";
import { Wrench, Pencil, UserCheck, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useAssignUserInCharge } from "../../Hooks/ReportsHooks";
import { useGetUsersByRoleFontanero } from "@/Modules/Users/Hooks/UsersHooks";
import type { ReportListItem } from "../../Models/Report";

type Props = {
  report: ReportListItem;
  readOnly?: boolean;
};

const AssignPlumberPanel = ({ report, readOnly = false }: Props) => {
  const [isEditing, setIsEditing] = useState(!readOnly && !report.AssignedPlumber);
  const [selectedPlumberId, setSelectedPlumberId] = useState<string>(
    report.PlumberUserId ? String(report.PlumberUserId) : "",
  );
  const [instructions, setInstructions] = useState(report.Instructions ?? "");

  const { fontaneros, isPending: loadingFontaneros } = useGetUsersByRoleFontanero();
  const assignMutation = useAssignUserInCharge();

  const handleSubmit = () => {
    if (!selectedPlumberId) {
      toast.error("Selecciona un fontanero");
      return;
    }

    assignMutation.mutate(
      {
        reportId: String(report.Id),
        plumberUserId: Number(selectedPlumberId),
        instructions: instructions.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Fontanero asignado correctamente");
          setIsEditing(false);
        },
        onError: (err) => {
          toast.error(err.message ?? "No se pudo asignar el fontanero");
        },
      },
    );
  };

  const handleCancel = () => {
    setSelectedPlumberId(report.PlumberUserId ? String(report.PlumberUserId) : "");
    setInstructions(report.Instructions ?? "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Wrench className="h-4 w-4" />
            Fontanero asignado
          </CardTitle>
          {!readOnly && !isEditing && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 px-2 text-xs"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3 w-3" />
              {report.AssignedPlumber ? "Cambiar" : "Asignar"}
            </Button>
          )}
        </div>
      </CardHeader>
      <Separator />

      <CardContent className="space-y-4 pt-4">
        {/* Vista de solo lectura */}
        {!isEditing && report.AssignedPlumber && (
          <>
            <div className="flex items-start gap-3">
              <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Nombre
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {report.AssignedPlumber.FullName ?? report.AssignedPlumber.Name}
                </p>
                {report.AssignedPlumber.Email && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {report.AssignedPlumber.Email}
                  </p>
                )}
              </div>
            </div>
            {report.Instructions && (
              <div className="flex items-start gap-3">
                <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Instrucciones
                  </p>
                  <p className="mt-0.5 whitespace-pre-wrap text-sm font-medium">
                    {report.Instructions}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Sin fontanero asignado (solo lectura) */}
        {!isEditing && !report.AssignedPlumber && (
          <p className="text-sm text-muted-foreground">Sin fontanero asignado</p>
        )}

        {/* Formulario de asignación */}
        {isEditing && !readOnly && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Fontanero
              </label>
              <Select
                value={selectedPlumberId}
                onValueChange={setSelectedPlumberId}
                disabled={loadingFontaneros}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue
                    placeholder={
                      loadingFontaneros ? "Cargando..." : "Selecciona un fontanero"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {fontaneros.map((f) => (
                    <SelectItem key={f.Id} value={String(f.Id)}>
                      {[f.Name, f.Surname1, f.Surname2].filter(Boolean).join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Instrucciones{" "}
                <span className="normal-case font-normal text-muted-foreground/60">
                  (opcional)
                </span>
              </label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ej. Revisar la fuga principal, aislar el tramo y reportar hallazgos."
                rows={3}
                maxLength={500}
                className="resize-none text-sm"
              />
              <p className="text-right text-[11px] text-muted-foreground">
                {instructions.length}/500
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 gap-1.5"
                onClick={handleSubmit}
                disabled={assignMutation.isPending || !selectedPlumberId}
              >
                <Check className="h-3.5 w-3.5" />
                {assignMutation.isPending ? "Guardando..." : "Guardar asignación"}
              </Button>
              {report.AssignedPlumber && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={handleCancel}
                  disabled={assignMutation.isPending}
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignPlumberPanel;
