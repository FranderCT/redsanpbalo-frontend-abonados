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
import { useReqAvailWaterFolderLink } from "../RequestAvailabilityWater/Hooks/ReqAvailWaterHooks";

interface RequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  excludeFields?: string[];
}

const formatDateOnly = (value?: string | Date) => {
  if (!value) return "-";
  try {
    if (typeof value === "string") {
      const onlyDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (onlyDate) return value;
      const d = new Date(value);
      if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    const d = value as Date;
    if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "-";
  }
  return "-";
};

const normalizeState = (s: string) =>
  s?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();

const stateColorsDict: Record<string, string> = {
  pendiente: "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  "en proceso": "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  aprobado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
  rechazado: "bg-[#FFE8E8] text-[#F6132D] border border-[#F6132D]/30",
  finalizado: "bg-[#F9F5FF] text-[#091540] border border-[#091540]/20",
};

const guessStateColor = (normalized: string) => {
  if (stateColorsDict[normalized]) return stateColorsDict[normalized];
  if (normalized.includes("aproba")) return stateColorsDict.aprobado;
  if (normalized.includes("rechaz")) return stateColorsDict.rechazado;
  if (normalized.includes("pend") || normalized.includes("proce")) return stateColorsDict.pendiente;
  return "bg-gray-100 text-gray-700 border border-gray-300";
};

const fieldLabels: Record<string, string> = {
  Date: "Fecha de Solicitud",
  Justification: "Justificación",
  Location: "Ubicación",
  NIS: "Número de Identificación del Suministro",
  StateRequest: "Estado de la Solicitud",
  User: "Usuario Solicitante",
  SpaceOfDocument: "Carpeta de Documentos",
};

export default function RequestDetailModalAdmin({
  open,
  onClose,
  title,
  data,
  excludeFields = [
    "Id",
    "UserId",
    "CreatedAt",
    "UpdatedAt",
    "IsActive",
    "CanComment",
    "commentRquest",
    "RequestAvailabilityWaterFiles",
    "MeterChangeFiles",
    "RequestMeterChangeFiles",
    "RequestChangeNameMeterFile",
  ],
}: RequestDetailModalProps) {
  const { mutate: getFolderLink, isPending } = useReqAvailWaterFolderLink();

  const handleOpenFolder = () => {
    if (!data.Id) return;
    getFolderLink(data.Id);
  };

  const renderValue = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-";

    if (key === "StateRequest" && typeof value === "object" && value.Name) {
      return (
        <span className={`inline-block rounded-none px-3 py-1.5 text-sm uppercase tracking-wide ${guessStateColor(normalizeState(value.Name))}`}>
          {value.Name}
        </span>
      );
    }

    if (key === "User" && typeof value === "object") {
      return (
        <div className="space-y-2 border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm">
            <span className="font-medium text-gray-700">Nombre:</span>{" "}
            {[value.Name, value.Surname1, value.Surname2].filter(Boolean).join(" ") || "-"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Cédula:</span> {value.IDcard || "-"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Email:</span> {value.Email || "-"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Teléfono:</span> {value.PhoneNumber || "-"}
          </p>
        </div>
      );
    }

    if (key === "Date" || key === "CreatedAt" || key === "UpdatedAt") {
      return formatDateOnly(value);
    }

    if (key === "SpaceOfDocument") {
      return (
        <Button
          type="button"
          onClick={handleOpenFolder}
          disabled={isPending || !data.Id}
          className="rounded-none bg-[#1789FC] text-white hover:bg-[#0f6fd1]"
        >
          {isPending ? "Abriendo..." : "Ver carpeta en Dropbox"}
        </Button>
      );
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

  const filteredEntries = Object.entries(data).filter(([key]) => !excludeFields.includes(key));

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-2xl rounded-none border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-[#091540]">{title}</DialogTitle>
          <DialogDescription>Información detallada de la solicitud</DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {filteredEntries.map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {fieldLabels[key] || key}
                </label>
                <div className="text-sm text-gray-900">{renderValue(key, value)}</div>
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
