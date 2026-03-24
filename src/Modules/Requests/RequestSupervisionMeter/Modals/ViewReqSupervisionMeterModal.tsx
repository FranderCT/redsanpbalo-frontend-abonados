import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Separator } from "@/Components/ui/separator";
import type { ReqSupervisionMeter } from "../Models/ReqSupervisionMeter";
import { formatRequestSupervisionMeterDate } from "../utils/requestSupervisionMeterDate";

type RequestStateLike = {
  Name?: string;
  name?: string;
};

type UserLike = {
  Name?: string;
  Surname1?: string;
  Surname2?: string;
  IDcard?: string;
  Email?: string;
  PhoneNumber?: string;
  Address?: string;
};

interface ViewReqSupervisionMeterModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: ReqSupervisionMeter;
  excludeFields?: string[];
}

const normalizeState = (value: string) =>
  value
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const stateColorsDict: Record<string, string> = {
  pendiente: "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  "en proceso": "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  aprobado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
  completado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
  rechazado: "bg-[#FFE8E8] text-[#F6132D] border border-[#F6132D]/30",
  finalizado: "bg-[#F9F5FF] text-[#091540] border border-[#091540]/20",
};

const guessStateColor = (normalized: string) => {
  if (stateColorsDict[normalized]) return stateColorsDict[normalized];
  if (normalized.includes("aproba") || normalized.includes("complet")) {
    return stateColorsDict.aprobado;
  }
  if (normalized.includes("rechaz")) return stateColorsDict.rechazado;
  if (normalized.includes("pend") || normalized.includes("proce")) {
    return stateColorsDict.pendiente;
  }
  return "bg-gray-100 text-gray-700 border border-gray-300";
};

const fieldLabels: Record<string, string> = {
  Date: "Fecha de Solicitud",
  Location: "Ubicación",
  Justification: "Justificación",
  NIS: "NIS",
  StateRequest: "Estado de la Solicitud",
  User: "Usuario Solicitante",
};

export default function ViewReqSupervisionMeterModal({
  open,
  onClose,
  title,
  data,
  excludeFields = [
    "Id",
    "CreatedAt",
    "UpdatedAt",
    "IsActive",
    "CanComment",
    "commentRquest",
  ],
}: ViewReqSupervisionMeterModalProps) {
  const renderValue = (key: string, value: unknown) => {
    if (value === null || value === undefined) return "-";

    if (key === "StateRequest" && typeof value === "object") {
      const stateValue = value as RequestStateLike;
      const stateName = stateValue.Name || stateValue.name;
      if (stateName) {
        return (
          <span
            className={`inline-block rounded-none px-3 py-1.5 text-sm uppercase tracking-wide ${guessStateColor(normalizeState(stateName))}`}
          >
            {stateName}
          </span>
        );
      }
    }

    if (key === "User" && typeof value === "object") {
      const userValue = value as UserLike;
      return (
        <div className="space-y-2 border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm">
            <span className="font-medium text-gray-700">Nombre:</span>{" "}
            {[userValue.Name, userValue.Surname1, userValue.Surname2]
              .filter(Boolean)
              .join(" ") || "-"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Cédula:</span>{" "}
            {userValue.IDcard || "-"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Correo:</span>{" "}
            {userValue.Email || "-"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Teléfono:</span>{" "}
            {userValue.PhoneNumber || "-"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Dirección:</span>{" "}
            {userValue.Address || "-"}
          </p>
        </div>
      );
    }

    if (key === "Date") {
      return formatRequestSupervisionMeterDate(value as string | Date);
    }

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (typeof value === "object") {
      return (
        <pre className="overflow-x-auto bg-gray-100 p-2 text-xs">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return String(value);
  };

  const filteredEntries = Object.entries(data).filter(
    ([key]) => !excludeFields.includes(key),
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-2xl rounded-none border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-[#091540]">{title}</DialogTitle>
          <DialogDescription>
            Información detallada de la solicitud de supervisión de medidor
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {filteredEntries.map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {fieldLabels[key] || key}
                </label>
                <div className="text-sm text-gray-900">
                  {renderValue(key, value)}
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button onClick={onClose} variant="secondary" className="rounded-none">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
