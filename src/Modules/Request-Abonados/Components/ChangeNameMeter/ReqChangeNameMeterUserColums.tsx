import type { ColumnDef } from "@tanstack/react-table";
import type { ReqChangeNameMeter } from "../../../Requests/RequestChangeNameMeter/Models/RequestChangeNameMeter";
import { InfoIcon } from "lucide-react";


const normalizeState = (s: string) =>
  s
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// 🎨 Estilos de estado adaptados a tu paleta
const stateColorsDict: Record<string, string> = {
  pendiente: "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  "en proceso": "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  aprobado: "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30",
  rechazado: "bg-[#FFE8E8] text-[#F6132D] border border-[#F6132D]/30",
  finalizado: "bg-[#F9F5FF] text-[#091540] border border-[#091540]/20",
};

// Fallback por coincidencias
const guessStateColor = (normalized: string) => {
  if (stateColorsDict[normalized]) return stateColorsDict[normalized];
  if (normalized.includes("aproba")) return stateColorsDict["aprobado"];
  if (normalized.includes("rechaz")) return stateColorsDict["rechazado"];
  if (normalized.includes("pend") || normalized.includes("proce"))
    return stateColorsDict["pendiente"];
};

export const ReqChangeNameMeterUserColumns = (
  onGetInfo?: (req: ReqChangeNameMeter) => void
): ColumnDef<ReqChangeNameMeter>[] => [
  {
    id: "Date",
    header: "Fecha Solicitud",
    cell: ({ row }) => (row.original.Date),
  },
  {
    id: "Justification",
    header: "Justificación",
    cell: ({ row }) => row.original.Justification ?? "-",
  },
  {
    id: "RequestState",
    header: "Estado",
    cell: ({ row }) => {
      const raw = row.original.StateRequest?.Name ?? "-";
      const normalized = normalizeState(raw);
      const colorClass = guessStateColor(normalized || "");

      return (
        <div className="flex justify-center">
          <span
            className={`min-w-[80px] px-3 py-1.5  text-sm  tracking-wide uppercase ${colorClass}`}
          >
            {raw}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <button
          onClick={() => onGetInfo?.(row.original)}
          className="flex items-center gap-1 px-3 py-1 text-xs font-medium border text-[#222] border-[#222] hover:bg-[#091540] hover:text-[#f5f5f5] transition cursor-pointer"
        >
          <InfoIcon className="w-4 h-4" />
          Ver más
        </button>
      </div>
    ),
  },
];
