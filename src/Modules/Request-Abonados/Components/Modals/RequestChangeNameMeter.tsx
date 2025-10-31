import { useState, useEffect } from "react";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useTempCMLink } from "../../Hooks/ChangeNameMeter/ChangeNameMeterHookF";

    interface MeterChangeDetailModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    data: Record<string, any>;
    excludeFields?: string[];
    }

    // ---- helpers ----
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
        } else {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
        }
        }

        const d = value as Date;
        if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
        }
    } catch {}
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
    Id: "ID de Solicitud",
    Date: "Fecha de Solicitud",
    Justification: "Justificación",
    Location: "Ubicación",
    Address: "Dirección",
    MeterNumber: "Número de Medidor Actual",
    NewMeterNumber: "Número de Medidor Nuevo",
    MeterCondition: "Condición del Medidor",
    Reason: "Motivo del Cambio",
    Observations: "Observaciones",
    StateRequest: "Estado de la Solicitud",
    UserId: "ID de Usuario",
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
    MeterChangeFiles: "Documentos Adjuntos",
    RequestMeterChangeFiles: "Documentos Adjuntos",
    };

    export default function MeterChangeDetailModal({
    open,
    onClose,
    title,
    data,
    excludeFields = ["Id", "UserId", "CreatedAt", "UpdatedAt", "IsActive"],
    }: MeterChangeDetailModalProps) {
    const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
    const { data: tempLinkData, isLoading: isLoadingLink } = useTempCMLink(selectedFileId);

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

    const renderValue = (key: string, value: any) => {
        // if (value === null || value === undefined) return "-";

        // Estado de la solicitud
        if (key === "StateRequest" && typeof value === "object" && value.Name) {
        const normalized = normalizeState(value.Name);
        const colorClass = guessStateColor(normalized);
        return (
            <span className={`inline-block px-3 py-1.5 text-sm tracking-wide uppercase rounded ${colorClass}`}>
            {value.Name}
            </span>
        );
        }

        // Condición del medidor
        // if (key === "MeterCondition") {
        // const normalized = normalizeState(String(value));
        // const colorClass = guessStateColor(normalized);
        // return (
        //     <span className={`inline-block px-3 py-1.5 text-sm tracking-wide uppercase rounded ${colorClass}`}>
        //     {value}
        //     </span>
        // );
        // }

        // Usuario (objeto anidado)
        if (key === "User" && typeof value === "object") {
        return (
            <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
            {value.Name && (
                <p className="text-sm">
                <span className="font-medium text-gray-700">Nombre:</span>{" "}
                {value.Name} {value.Surname1} {value.Surname2}
                </p>
            )}
            {value.IDcard && (
                <p className="text-sm">
                <span className="font-medium text-gray-700">Cédula:</span> {value.IDcard}
                </p>
            )}
            {value.Email && (
                <p className="text-sm">
                <span className="font-medium text-gray-700">Email:</span> {value.Email}
                </p>
            )}
            {value.PhoneNumber && (
                <p className="text-sm">
                <span className="font-medium text-gray-700">Teléfono:</span> {value.PhoneNumber}
                </p>
            )}
            </div>
        );
        }

        // Fechas
        if (key === "Date" || key === "CreatedAt" || key === "UpdatedAt") {
        return formatDateOnly(value);
        }

        // SpaceOfDocument - Mostrar carpeta Y archivos
        if (key === "SpaceOfDocument") {
        // Buscar archivos en diferentes posibles propiedades
        const files = data.MeterChangeFiles || data.RequestChangeNameMeterFile || [];
        
        return (
            <div className="space-y-3">
            {/* Documentos disponibles */}
            {files.length > 0 ? (
                <div className="space-y-2">
                <div className="space-y-2">
                    {files.map((file: any) => {
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

        // // Ocultar archivos porque ya se muestran en SpaceOfDocument
        // if (key === "MeterChangeFiles" || key === "RequestMeterChangeFiles") {
        // return "-";
        // }

        // // Valores primitivos
        // if (typeof value === "string" || typeof value === "number") {
        // return String(value);
        // }

        // Objetos complejos
        // if (typeof value === "object") {
        // return (
        //     <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto border border-gray-200">
        //     {JSON.stringify(value, null, 2)}
        //     </pre>
        // );
        // }

        // return String(value);
    };

    const filteredEntries = Object.entries(data).filter(
        ([key]) => !excludeFields.includes(key)
    );

    return (
        <ModalBase open={open} onClose={onClose} panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 text-[#091540] border-b border-gray-200">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm opacity-80">Información detallada de la solicitud de cambio de medidor</p>
        </div>

        {/* Body */}
        <div
            className="px-6 py-4 max-h-[60vh] overflow-y-auto"
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {fieldLabels[key] || key}
                </label>
                <div className="text-sm text-gray-900">{renderValue(key, value)}</div>
                </div>
            ))}
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
            onClick={onClose}
            className="h-10 px-6 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium rounded-md"
            >
            Cerrar
            </button>
        </div>
        </ModalBase>
    );
    }