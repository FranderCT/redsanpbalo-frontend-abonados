import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useChangeReportState } from "../../Hooks/ReportsHooks";
import { REPORT_STATE_OPTIONS } from "../../Models/ReportEnums";
import type { ReportStateValue } from "../../Models/ReportEnums";
import type { Report } from "../../Models/Report";

const NOTE_MAX_LENGTH = 255;

type Props = {
  report: Report | null;
  open: boolean;
  onClose: () => void;
};

export default function ChangeReportStateModal({
  report,
  open,
  onClose,
}: Props) {
  const [newState, setNewState] = useState<ReportStateValue | "">("");
  const [note, setNote] = useState("");

  const changeStateMutation = useChangeReportState();

  useEffect(() => {
    if (open && report) {
      setNewState((report.State as ReportStateValue) || "");
      setNote("");
    }
  }, [open, report]);

  const currentState = report?.State ?? "";
  const isSameState =
    newState !== "" && String(newState).trim() === String(currentState).trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report?.Id || !newState || newState === "") {
      toast.error("Selecciona un estado");
      return;
    }
    if (isSameState) {
      toast.error("El estado seleccionado es el mismo actual");
      return;
    }
    try {
      await changeStateMutation.mutateAsync({
        reportId: report.Id,
        payload: {
          state: newState as "Pendiente" | "En progreso" | "Cancelado" | "Resuelto",
          note: note.trim() || undefined,
        },
      });
      toast.success("Estado actualizado. El cambio queda registrado en el historial.");
      onClose();
    } catch {
      toast.error("Error al cambiar el estado");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-h-[70vh] gap-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Cambiar estado del reporte</DialogTitle>
          <DialogDescription>
            El nuevo estado quedará registrado en el historial y se notificará por el sistema.
            Estado actual: <strong>{currentState || "—"}</strong>
          </DialogDescription>
        </DialogHeader>

        <form
          id="change-state-form"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto overflow-x-hidden px-6 py-4">
            <FieldGroup className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="change-state-select">Nuevo estado</FieldLabel>
                <Select
                  value={newState === "" ? "__placeholder__" : newState}
                  onValueChange={(v) =>
                    setNewState(v === "__placeholder__" ? "" : (v as ReportStateValue))
                  }
                >
                  <SelectTrigger id="change-state-select">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__placeholder__" disabled>
                      Seleccionar estado
                    </SelectItem>
                    {REPORT_STATE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="change-state-note">
                  Nota o motivo (opcional, máx. {NOTE_MAX_LENGTH} caracteres)
                </FieldLabel>
                <Textarea
                  id="change-state-note"
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value.slice(0, NOTE_MAX_LENGTH))
                  }
                  placeholder="Ej: Reparación completada en sitio"
                  rows={3}
                  maxLength={NOTE_MAX_LENGTH}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {note.length}/{NOTE_MAX_LENGTH}
                </p>
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form="change-state-form"
                disabled={
                  !newState ||
                  isSameState ||
                  changeStateMutation.isPending
                }
                className="w-full sm:w-auto"
              >
                {changeStateMutation.isPending ? "Guardando…" : "Cambiar estado"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
