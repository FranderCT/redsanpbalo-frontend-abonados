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
    import { useReqAssociatedFolderLink } from "../../Hooks/ReqAssociatedHooks";
    import { formatAssociatedRequestDate } from "../../utils/associatedRequestDate";

    type DetailData = Record<string, unknown>;

    interface ReqSubscriberDetailModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    data: DetailData;
    excludeFields?: string[];
    }

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
    Id: "ID de Solicitud",
    Date: "Fecha de Solicitud",
    SubscriberType: "Tipo de Abonado",
    ServiceType: "Tipo de Servicio",
    PropertyType: "Tipo de Propiedad",
    Justification: "Justificación",
    Observations: "Observaciones",
    Location: "Ubicación",
    Address: "Dirección",
    PhysicalAddress: "Dirección Física",
    ServiceAddress: "Dirección del Servicio",
    MeterNumber: "Número de Medidor",
    NIS: "Número de Identificación del Suministro",
    StateRequest: "Estado de la Solicitud",
    UserId: "ID de Usuario",
    User: "Usuario Solicitante",
    CreatedAt: "Fecha de Creación",
    UpdatedAt: "Última Actualización",
    SpaceOfDocument: "Carpeta de Documentos",
    };

    export default function ReqAssociatedAdminModal({
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
        "RequestAssociatedFile",
        "NIS",
        // Excluir campos individuales del usuario que se muestran en la tarjeta
        "Name",
        "Surname1", 
        "Surname2",
        "Email",
        "PhoneNumber",
        "IDcard"
    ],
    }: ReqSubscriberDetailModalProps) {
    const { mutate: getFolderLink, isPending } = useReqAssociatedFolderLink();

    const handleOpenFolder = () => {
        if (!data.Id) {
        console.error('❌ No hay ID en data');
        alert("Error: No se encontró el ID de la solicitud");
        return;
        }
        
        getFolderLink(data.Id);
    };

    const renderValue = (key: string, value: unknown) => {
        if (value === null || value === undefined) return "-";

        // Estado de la solicitud
        if (key === "StateRequest" && typeof value === "object") {
        const stateName = value.Name || value.name;
        
        if (stateName) {
            const normalized = normalizeState(stateName);
            const colorClass = guessStateColor(normalized);
            return (
            <span className={`inline-block px-3 py-1.5 text-sm tracking-wide uppercase rounded-none ${colorClass}`}>
                {stateName}
            </span>
            );
        }
        }

        // Usuario (objeto anidado)
        if (key === "User" && typeof value === "object") {
        return (
            <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
            {value.Name && (
                <p className="text-sm">
                <span className="font-medium text-gray-700">Nombre:</span>{" "}
                {value.Name} {value.Surname1 || ""} {value.Surname2 || ""}
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
        return formatAssociatedRequestDate(value as string | Date);
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
        <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
        <DialogContent className="max-w-2xl rounded-none border-slate-200 p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-4">
            <DialogTitle className="text-[#091540]">{title}</DialogTitle>
            <DialogDescription>Información detallada de la solicitud de abonado</DialogDescription>
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
