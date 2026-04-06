import { useEffect, useState } from "react";
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
import { useTempLink } from "../../Hooks/AvailabilityWater/AvailabilityWaterHookF";

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

      const hasTZ = /[Tt].*(Z|[+\-]\d{2}:?\d{2})$/.test(value);
      const d = new Date(value);
      if (isNaN(d.getTime())) return "-";

      if (hasTZ) {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      }

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    const d = value as Date;
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
  } catch {
    return "-";
  }
  return "-";
};

const normalizeState = (s: string) =>
  s
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const stateColorsDict: Record<string, string> = {
  pendiente: "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  "en proceso": "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  "en revision": "bg-amber-50 text-amber-700 border border-amber-200",
  "en tramite": "bg-amber-50 text-amber-700 border border-amber-200",
  aprobado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
  rechazado: "bg-[#FFE8E8] text-[#F6132D] border border-[#F6132D]/30",
  finalizado: "bg-[#F9F5FF] text-[#091540] border border-[#091540]/20",
};

const guessStateColor = (normalized: string) => {
  if (stateColorsDict[normalized]) return stateColorsDict[normalized];
  if (normalized.includes("aproba")) return stateColorsDict.aprobado;
  if (normalized.includes("rechaz")) return stateColorsDict.rechazado;
  if (normalized.includes("revision") || normalized.includes("tramite")) return stateColorsDict["en revision"];
  if (normalized.includes("pend") || normalized.includes("proce")) {
    return stateColorsDict.pendiente;
  }
  return "bg-gray-100 text-gray-700 border border-gray-300";
};

const fieldLabels: Record<string, string> = {
  Date: "Fecha de Solicitud",
  Justification: "Justificación",
  Location: "Ubicación",
  NIS: "Número de Identificación del Suministro",
  StateRequest: "Estado de la Solicitud",
  User: "Usuario Solicitante",
  Name: "Nombre",
  Surname1: "Primer Apellido",
  Surname2: "Segundo Apellido",
  Email: "Correo Electrónico",
  PhoneNumber: "Teléfono",
  IDcard: "Cédula",
  SpaceOfDocument: "Documentos adjuntos",
};

export default function RequestAvailabilityWaterModalAbo({
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
  ],
}: RequestDetailModalProps) {
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const { data: tempLinkData, isLoading: isLoadingLink } = useTempLink(selectedFileId);

  useEffect(() => {
    if (tempLinkData?.link && selectedFileId) {
      window.open(tempLinkData.link, "_blank", "noopener,noreferrer");
      setSelectedFileId(null);
    }
  }, [tempLinkData, selectedFileId]);

  const handleDownloadFile = (fileId: number) => {
    setSelectedFileId(fileId);
  };

  const renderValue = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-";

    if (key === "StateRequest" && typeof value === "object" && value.Name) {
      const normalized = normalizeState(value.Name);
      return (
        <span className={`inline-block rounded-none px-3 py-1.5 text-sm uppercase tracking-wide ${guessStateColor(normalized)}`}>
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

    if (key === "Date") {
      return formatDateOnly(value);
    }

    if (key === "SpaceOfDocument") {
      const files = data.RequestAvailabilityWaterFiles || [];

      if (!files.length) {
        return (
          <div className="border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            No se encontraron documentos adjuntos.
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {files.map((file: any) => {
            const fileId = file?.Id || file?.id;
            const fileName = file?.Name || file?.name || file?.FileName || "Documento";
            const isDownloading = isLoadingLink && selectedFileId === fileId;

            if (!fileId) return null;

            return (
              <Button
                key={fileId}
                type="button"
                variant="outline"
                className="flex h-auto w-full items-center justify-between gap-3 rounded-none px-4 py-3"
                onClick={() => handleDownloadFile(fileId)}
                disabled={isDownloading}
              >
                <span className="truncate text-left">{fileName}</span>
                <span className="text-xs text-slate-500">
                  {isDownloading ? "Abriendo..." : "Abrir"}
                </span>
              </Button>
            );
          })}
        </div>
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
