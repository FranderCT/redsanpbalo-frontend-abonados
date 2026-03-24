import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useTempSMLink } from "../../Hooks/Supervision-Meter/SupervisionMeterHookF";
import { formatRequestChangeMeterDate } from "../../../Requests/RequestChangeMeterr/utils/requestChangeMeterDate";


interface MeterSupervisionDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: object;
  excludeFields?: string[];
}

type RequestDocument = {
  Id?: number;
  id?: number;
  Name?: string;
  name?: string;
  FileName?: string;
};

type DetailEntryMap = Record<string, unknown>;

const hasKey = (value: object, key: string): value is DetailEntryMap =>
  key in value;

const isDateValue = (value: unknown): value is string | Date | null | undefined =>
  value === null ||
  value === undefined ||
  typeof value === "string" ||
  value instanceof Date;

// ---- helpers ----
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
  aprobado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
  rechazado: "bg-[#FFE8E8] text-[#F6132D] border border-[#F6132D]/30",
  finalizado: "bg-[#F9F5FF] text-[#091540] border border-[#091540]/20",
  completado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
};

const guessStateColor = (normalized: string) => {
  if (stateColorsDict[normalized]) return stateColorsDict[normalized];
  if (normalized.includes("aproba") || normalized.includes("complet"))
    return stateColorsDict["aprobado"];
  if (normalized.includes("rechaz")) return stateColorsDict["rechazado"];
  if (normalized.includes("pend") || normalized.includes("proce"))
    return stateColorsDict["pendiente"];
  return "bg-gray-100 text-gray-700 border border-gray-300";
};

const fieldLabels: Record<string, string> = {
  Id: "ID de Supervisión",
  Date: "Fecha de Supervisión",
  MeterNumber: "Número de Medidor",
  Reading: "Lectura del Medidor",
  PreviousReading: "Lectura Anterior",
  Consumption: "Consumo (m³)",
  MeterCondition: "Condición del Medidor",
  Observations: "Observaciones",
  Location: "Ubicación",
  Address: "Dirección",
  NIS: "Número de Identificación del Suministro",
  Justification: "Justificación",
  StateRequest: "Estado de la Solicitud",
  SupervisorId: "ID de Supervisor",
  Supervisor: "Supervisor Asignado",
  User: "Usuario Solicitante",
  Name: "Nombre",
  Surname1: "Primer Apellido",
  Surname2: "Segundo Apellido",
  Email: "Correo Electrónico",
  PhoneNumber: "Teléfono",
  IDcard: "Cédula",
  CreatedAt: "Fecha de Creación",
  UpdatedAt: "Última Actualización",
  SpaceOfDocument: "Carpeta de Documentos",
};

export default function MeterSupervisionDetailModal({
  open,
  onClose,
  title,
  data,
  excludeFields = ["Id", "SupervisorId", "CreatedAt", "UpdatedAt", "IsActive", "RequestSupervisionMeterFiles", "SupervisionMeterFiles","NIS"],
}: MeterSupervisionDetailModalProps) {
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const { data: tempLinkData, isLoading: isLoadingLink } = useTempSMLink(selectedFileId);

  // Auto-abrir cuando el link esté listo
  useEffect(() => {
    if (tempLinkData?.link && selectedFileId) {
      console.log('Abriendo documento:', tempLinkData.link);
      window.open(tempLinkData.link, "_blank", "noopener,noreferrer");
      setSelectedFileId(null);
    }
  }, [tempLinkData, selectedFileId]);

  const handleDownloadFile = (fileId: number, fileName: string) => {
    console.log('Solicitando descarga:', { fileId, fileName });
    setSelectedFileId(fileId);
  };

  const renderValue = (key: string, value: unknown) => {
    if (value === null || value === undefined) return "-";

    // Estado de la solicitud
    if (
      key === "StateRequest" &&
      typeof value === "object" &&
      value !== null &&
      "Name" in value &&
      typeof value.Name === "string"
    ) {
      const normalized = normalizeState(value.Name);
      const colorClass = guessStateColor(normalized);
      return (
        <span className={`inline-block px-3 py-1.5 text-sm tracking-wide uppercase rounded ${colorClass}`}>
          {value.Name}
        </span>
      );
    }

    // Supervisor/Usuario (objeto anidado)
    if ((key === "Supervisor" || key === "User") && typeof value === "object" && value !== null) {
      const person = value as {
        Name?: string;
        Surname1?: string;
        Surname2?: string;
        IDcard?: string;
        Email?: string;
        PhoneNumber?: string;
      };
      return (
        <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
          {person.Name && (
            <p className="text-sm">
              <span className="font-medium text-gray-700">Nombre:</span>{" "}
              {person.Name} {person.Surname1} {person.Surname2}
            </p>
          )}
          {person.IDcard && (
            <p className="text-sm">
              <span className="font-medium text-gray-700">Cédula:</span> {person.IDcard}
            </p>
          )}
          {person.Email && (
            <p className="text-sm">
              <span className="font-medium text-gray-700">Email:</span> {person.Email}
            </p>
          )}
          {person.PhoneNumber && (
            <p className="text-sm">
              <span className="font-medium text-gray-700">Teléfono:</span> {person.PhoneNumber}
            </p>
          )}
        </div>
      );
    }

    // Fechas
    if (key === "Date" || key === "CreatedAt" || key === "UpdatedAt") {
      return formatRequestChangeMeterDate(isDateValue(value) ? value : undefined);
    }

    // SpaceOfDocument - Mostrar carpeta Y archivos
    if (key === "SpaceOfDocument") {
      // Buscar archivos en diferentes posibles propiedades
      const requestFiles = hasKey(data, "RequestSupervisionMeterFiles")
        ? data.RequestSupervisionMeterFiles
        : undefined;
      const supervisionFiles = hasKey(data, "SupervisionMeterFiles")
        ? data.SupervisionMeterFiles
        : undefined;
      const files = (Array.isArray(requestFiles) ? requestFiles : Array.isArray(supervisionFiles) ? supervisionFiles : []) as RequestDocument[];
      
      return (
        <div className="space-y-3">
          {/* Documentos disponibles */}
          {files.length > 0 ? (
            <div className="space-y-2">
              <div className="space-y-2">
                {files.map((file) => {
                  const fileId = file?.Id || file?.id;
                  const fileName = file?.Name || file?.name || file?.FileName || `Documento`;
                  const isDownloading = isLoadingLink && selectedFileId === fileId;

                  if (!fileId) {
                    console.warn('Archivo sin ID:', file);
                    return null;
                  }

                  return (
                    <button
                      key={fileId}
                      type="button"
                      onClick={() => handleDownloadFile(fileId, fileName)}
                      disabled={isDownloading}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-md transition-all disabled:bg-gray-100 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-gray-900 truncate text-left">
                          {fileName}
                        </span>
                      </div>
                      
                      {isDownloading ? (
                        <div className="flex items-center gap-2 text-blue-600 flex-shrink-0">
                          <svg className="animate-spin h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="text-xs font-medium">Abriendo...</span>
                        </div>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                No se encontraron documentos adjuntos
              </p>
            </div>
          )}
        </div>
      );
    }

    // Valores primitivos
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    // Objetos complejos
    if (typeof value === "object") {
      return (
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto border border-gray-200">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return String(value);
  };

  const filteredEntries = Object.entries(data as DetailEntryMap).filter(
    ([key]) => !excludeFields.includes(key)
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="max-w-2xl rounded-none border-slate-200 p-0">
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-[#091540]">{title}</DialogTitle>
          <DialogDescription>
            Información detallada de la supervisión de medidor
          </DialogDescription>
        </DialogHeader>

        <div
          className="max-h-[60vh] overflow-y-auto px-6 py-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            .overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="space-y-4">
            {filteredEntries.map(([key, value]) => (
              <div key={key} className="border-b border-gray-200 pb-3 last:border-b-0">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {fieldLabels[key] || key}
                </label>
                <div className="text-sm text-gray-900">{renderValue(key, value)}</div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <Button type="button" variant="outline" className="rounded-none" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
