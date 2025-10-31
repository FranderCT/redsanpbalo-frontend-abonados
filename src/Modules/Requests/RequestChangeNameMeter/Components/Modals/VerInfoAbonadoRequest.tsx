import { ModalBase } from "../../../../../Components/Modals/ModalBase";
import { useReqChangeNameFolderLink } from "../../Hooks/RequestChangeNameMeterHooks";

 

    interface MeterSupervisionDetailModalProps {
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
    completado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
    rechazado: "bg-[#FFE8E8] text-[#F6132D] border border-[#F6132D]/30",
    finalizado: "bg-[#F9F5FF] text-[#091540] border border-[#091540]/20",
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
    StateRequest: "Estado de la Solicitud",
    SupervisorId: "ID de Supervisor",
    Supervisor: "Supervisor Asignado",
    User: "Usuario Supervisor",
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

    export default function MeterSupervisionDetailModalAdmin({
    open,
    onClose,
    title,
    data,
    excludeFields = ["Id", "SupervisorId", "CreatedAt", "UpdatedAt", "IsActive"],
    }: MeterSupervisionDetailModalProps) {
    const { mutate: getFolderLink, isPending } = useReqChangeNameFolderLink();

    const handleOpenFolder = () => {
        console.log('🔍 Intentando abrir carpeta para ID:', data.Id);
        console.log('📦 Data completa:', data);
        
        if (!data.Id) {
        console.error('❌ No hay ID en data');
        alert("Error: No se encontró el ID de la supervisión");
        return;
        }
        
        getFolderLink(data.Id);
    };

    const renderValue = (key: string, value: any): React.ReactElement | string => {
        if (value === null || value === undefined) return "-";

        // Estado de la solicitud
        if (key === "StateRequest" && typeof value === "object") {
        const stateName = value.Name || value.name;
        
        if (stateName) {
            const normalized = normalizeState(stateName);
            const colorClass = guessStateColor(normalized);
            return (
            <span className={`inline-block px-3 py-1.5 text-sm tracking-wide uppercase rounded ${colorClass}`}>
                {stateName}
            </span>
            );
        }
        }

        // Condición del medidor
        if (key === "MeterCondition") {
        const normalized = normalizeState(String(value));
        const colorClass = guessStateColor(normalized);
        return (
            <span className={`inline-block px-3 py-1.5 text-sm tracking-wide uppercase rounded ${colorClass}`}>
            {value}
            </span>
        );
        }

        // Supervisor/Usuario (objeto anidado)
        if ((key === "Supervisor" || key === "User") && typeof value === "object") {
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

        // SpaceOfDocument - Integración con Dropbox
        if (key === "SpaceOfDocument") {
        return (
            <button
            type="button"
            onClick={handleOpenFolder}
            disabled={isPending || !data.Id}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
            >
            {isPending ? (
                <>
                <svg className="animate-spin h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Abriendo...
                </>
            ) : (
                <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver carpeta en Dropbox
                </>
            )}
            </button>
        );
        }

        // Valores primitivos
        if (typeof value === "string" || typeof value === "number") {
        return String(value);
        }

        // Objetos complejos
        if (typeof value === "object") {
        return (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(value, null, 2)}
            </pre>
        );
        }

        return String(value);
    };

    const filteredEntries = Object.entries(data).filter(
        ([key]) => !excludeFields.includes(key)
    );

    return (
        <ModalBase open={open} onClose={onClose} panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 text-[#091540] border-b border-gray-200">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm opacity-80">Información detallada de la supervisión de medidor</p>
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