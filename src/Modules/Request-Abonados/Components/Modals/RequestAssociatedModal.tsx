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
import { useTempLinkAssociated } from "../../Hooks/Associated/AssociatedRqHook";

type RequestAssociatedFile = {
  Id?: number;
  id?: number;
  Name?: string;
  name?: string;
  FileName?: string;
};

type AssociatedUser = {
  Name?: string;
  Surname1?: string;
  Surname2?: string;
  IDcard?: string;
  Email?: string;
  PhoneNumber?: string;
};

type AssociatedState = {
  Name?: string;
};

type AssociatedDetailData = Record<string, unknown> & {
  RequestAssociatedFile?: RequestAssociatedFile[];
};

interface AssociatedDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: AssociatedDetailData;
  excludeFields?: string[];
}

const formatDateOnly = (value?: string | Date) => {
  if (!value) return "-";

  try {
    if (typeof value === "string") {
      const onlyDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (onlyDate) return value;

      const hasTZ = /[Tt].*(Z|[+-]\d{2}:?\d{2})$/.test(value);
      const date = new Date(value);
      if (isNaN(date.getTime())) return "-";

      if (hasTZ) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    if (!isNaN(value.getTime())) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  } catch {
    return "-";
  }

  return "-";
};

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
  "en revision": "bg-amber-50 text-amber-700 border border-amber-200",
  "en tramite": "bg-amber-50 text-amber-700 border border-amber-200",
  aprobado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
  rechazado: "bg-[#FFE8E8] text-[#F6132D] border border-[#F6132D]/30",
  finalizado: "bg-[#F9F5FF] text-[#091540] border border-[#091540]/20",
  completado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
};

const guessStateColor = (normalized: string) => {
  if (stateColorsDict[normalized]) return stateColorsDict[normalized];
  if (normalized.includes("aproba") || normalized.includes("complet")) {
    return stateColorsDict.aprobado;
  }
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
  Address: "Dirección",
  NIS: "Número de Identificación del Suministro",
  Observations: "Observaciones",
  StateRequest: "Estado de la Solicitud",
  User: "Usuario Solicitante",
  SpaceOfDocument: "Carpeta de Documentos",
};

export default function AssociatedDetailModal({
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
    "Name",
    "Surname1",
    "Surname2",
    "IDcard",
    "Email",
    "PhoneNumber",
    "CanComment",
    "RequestAssociatedFile",
  ],
}: AssociatedDetailModalProps) {
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const { data: tempLinkData, isLoading: isLoadingLink } =
    useTempLinkAssociated(selectedFileId);

  useEffect(() => {
    if (tempLinkData?.link && selectedFileId) {
      console.log("Abriendo documento:", tempLinkData.link);
      window.open(tempLinkData.link, "_blank", "noopener,noreferrer");
      setSelectedFileId(null);
    }
  }, [tempLinkData, selectedFileId]);

  const handleDownloadFile = (fileId: number, fileName: string) => {
    console.log("Solicitando descarga:", { fileId, fileName });
    setSelectedFileId(fileId);
  };

  const renderValue = (
    key: string,
    value: unknown,
  ): React.ReactElement | string => {
    if (value === null || value === undefined) return "-";

    if (key === "StateRequest" && typeof value === "object") {
      const state = value as AssociatedState;
      if (state.Name) {
        const normalized = normalizeState(state.Name);
        const colorClass = guessStateColor(normalized);
        return (
          <span
            className={`inline-block rounded-none px-3 py-1.5 text-sm tracking-wide uppercase ${colorClass}`}
          >
            {state.Name}
          </span>
        );
      }
    }

    if (key === "User" && typeof value === "object") {
      const user = value as AssociatedUser;
      return (
        <div className="space-y-2 rounded border border-gray-200 bg-gray-50 p-3">
          {user.Name ? (
            <p className="text-sm">
              <span className="font-medium text-gray-700">Nombre:</span>{" "}
              {user.Name} {user.Surname1} {user.Surname2}
            </p>
          ) : null}
          {user.IDcard ? (
            <p className="text-sm">
              <span className="font-medium text-gray-700">Cédula:</span>{" "}
              {user.IDcard}
            </p>
          ) : null}
          {user.Email ? (
            <p className="text-sm">
              <span className="font-medium text-gray-700">Email:</span>{" "}
              {user.Email}
            </p>
          ) : null}
          {user.PhoneNumber ? (
            <p className="text-sm">
              <span className="font-medium text-gray-700">Teléfono:</span>{" "}
              {user.PhoneNumber}
            </p>
          ) : null}
        </div>
      );
    }

    if (key === "Date" || key === "CreatedAt" || key === "UpdatedAt") {
      return formatDateOnly(value as string | Date);
    }

    if (key === "SpaceOfDocument") {
      const files = data.RequestAssociatedFile || [];

      return (
        <div className="space-y-3">
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file) => {
                const fileId = file.Id || file.id;
                const fileName =
                  file.Name || file.name || file.FileName || "Documento";
                const isDownloading =
                  isLoadingLink && selectedFileId === fileId;

                if (!fileId) {
                  console.warn("Archivo sin ID:", file);
                  return null;
                }

                return (
                  <button
                    key={fileId}
                    type="button"
                    onClick={() => handleDownloadFile(fileId, fileName)}
                    disabled={isDownloading}
                    className="group flex w-full items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm transition-all hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <svg
                        className="h-5 w-5 shrink-0 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate text-left font-medium text-gray-900">
                        {fileName}
                      </span>
                    </div>

                    {isDownloading ? (
                      <div className="flex shrink-0 items-center gap-2 text-blue-600">
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-xs font-medium">Abriendo...</span>
                      </div>
                    ) : (
                      <svg
                        className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-sm text-yellow-800">
                No se encontraron documentos adjuntos
              </p>
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (typeof value === "object") {
      return (
        <pre className="overflow-x-auto rounded border border-gray-200 bg-gray-100 p-2 text-xs">
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
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-w-2xl rounded-none border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-[#091540]">{title}</DialogTitle>
          <DialogDescription>
            Información detallada de la solicitud de asociado
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <style>{`
            .overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
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
