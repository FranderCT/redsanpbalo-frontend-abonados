import { useState } from "react";
import { Clock, ArrowRight, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Textarea } from "@/Components/ui/textarea";
import { useChangeReportState } from "../../Hooks/ReportsHooks";
import type { ReportListItem, ReportStateValue } from "../../Models/Report";

type Props = {
  report: ReportListItem;
  readOnly?: boolean;
};

const ALLOWED_TRANSITIONS: Record<ReportStateValue, ReportStateValue[]> = {
  Pendiente: ["En Proceso"],
  "En Proceso": ["Pendiente", "Resuelto"],
  Resuelto: ["En Proceso"],
};

const STATE_VARIANT: Record<
  ReportStateValue,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Pendiente: "outline",
  "En Proceso": "secondary",
  Resuelto: "default",
};

const STATE_BUTTON_CLASS: Record<ReportStateValue, string> = {
  Pendiente: "border-amber-400 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/30",
  "En Proceso": "border-blue-400 text-blue-700 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/30",
  Resuelto: "border-green-400 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30",
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ChangeStatePanel = ({ report, readOnly = false }: Props) => {
  const [targetState, setTargetState] = useState<ReportStateValue | null>(null);
  const [reason, setReason] = useState("");

  const changeStateMutation = useChangeReportState();

  const currentState = report.ReportState as ReportStateValue;
  const transitions = ALLOWED_TRANSITIONS[currentState] ?? [];

  const handleSelectTransition = (state: ReportStateValue) => {
    setTargetState(state);
    setReason("");
  };

  const handleCancel = () => {
    setTargetState(null);
    setReason("");
  };

  const handleConfirm = () => {
    if (!targetState) return;
    if (!reason.trim()) {
      toast.error("Escribe una razón para el cambio de estado");
      return;
    }

    changeStateMutation.mutate(
      {
        reportId: String(report.Id),
        newState: targetState,
        reasonChange: reason.trim(),
      },
      {
        onSuccess: () => {
          toast.success(`Estado cambiado a "${targetState}"`);
          setTargetState(null);
          setReason("");
        },
        onError: (err) => {
          toast.error(err.message ?? "No se pudo cambiar el estado");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Clock className="h-4 w-4" />
          Estado del reporte
        </CardTitle>
      </CardHeader>
      <Separator />

      <CardContent className="space-y-5 pt-4">
        {/* Estado actual + botones de transición */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Estado actual
            </p>
            <Badge variant={STATE_VARIANT[currentState] ?? "secondary"} className="text-xs">
              {currentState}
            </Badge>
          </div>

          {!readOnly && transitions.length > 0 && !targetState && (
            <div className="flex flex-wrap items-center gap-2 sm:ml-4">
              <span className="text-xs text-muted-foreground">Cambiar a →</span>
              {transitions.map((state) => (
                <button
                  key={state}
                  onClick={() => handleSelectTransition(state)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${STATE_BUTTON_CLASS[state] ?? ""}`}
                >
                  <ArrowRight className="h-3 w-3" />
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Formulario de cambio de estado */}
        {!readOnly && targetState && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Badge variant={STATE_VARIANT[currentState] ?? "secondary"} className="text-[11px]">
                {currentState}
              </Badge>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge variant={STATE_VARIANT[targetState] ?? "secondary"} className="text-[11px]">
                {targetState}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Razón del cambio <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej. Se asignó personal técnico y se inició la revisión en campo."
                rows={3}
                maxLength={500}
                className="resize-none bg-background text-sm"
                autoFocus
              />
              <p className="text-right text-[11px] text-muted-foreground">
                {reason.length}/500
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 gap-1.5"
                onClick={handleConfirm}
                disabled={changeStateMutation.isPending || !reason.trim()}
              >
                <Check className="h-3.5 w-3.5" />
                {changeStateMutation.isPending ? "Guardando..." : "Confirmar cambio"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleCancel}
                disabled={changeStateMutation.isPending}
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Historial de estados */}
        {report.StateHistory && report.StateHistory.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Historial
              </p>
              <ol className="space-y-3">
                {report.StateHistory.map((entry) => (
                  <li key={entry.Id} className="flex gap-3">
                    <div className="mt-1.5 flex h-2 w-2 shrink-0 items-start">
                      <span className="block h-2 w-2 rounded-full bg-primary/50" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {entry.PreviousState && (
                          <>
                            <Badge
                              variant={STATE_VARIANT[entry.PreviousState as ReportStateValue] ?? "secondary"}
                              className="text-[10px]"
                            >
                              {entry.PreviousState}
                            </Badge>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          </>
                        )}
                        <Badge
                          variant={STATE_VARIANT[entry.NewState as ReportStateValue] ?? "secondary"}
                          className="text-[10px]"
                        >
                          {entry.NewState}
                        </Badge>
                      </div>
                      {entry.ReasonChange && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.ReasonChange}
                        </p>
                      )}
                      <p className="mt-0.5 text-[11px] text-muted-foreground/60">
                        {formatDate(entry.CreatedAt)}
                        {entry.ChangedBy && (
                          <> · {entry.ChangedBy.FullName ?? entry.ChangedBy.Name}</>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChangeStatePanel;
