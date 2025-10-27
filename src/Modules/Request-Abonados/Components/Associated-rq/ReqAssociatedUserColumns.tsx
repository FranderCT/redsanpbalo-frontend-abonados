import type { ColumnDef } from "@tanstack/react-table";
import type { ReqAssociated } from "../../../Requests/RequestAssociated/Models/RequestAssociated";

// ---- helpers ----
const formatDateOnly = (value?: string | Date) => {
  if (!value) return "-";
  try {
    if (typeof value === "string") {
      const t = value.indexOf("T");
      if (t > 0) return value.slice(0, t);
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toLocaleDateString("es-CR");
      return value;
    }
    const d = value instanceof Date ? value : new Date(value);
    if (!isNaN(d.getTime())) return d.toLocaleDateString("es-CR");
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

export const ReqAssociatedUserColumns = (
  // onEdit: (req: ReqAvailWater) => void
  // onGetInfo?: (req: ReqAvailWater) => void
): ColumnDef<ReqAssociated>[] => [
  {
    id: "Date",
    header: "Fecha Solicitud",
    cell: ({ row }) => formatDateOnly(row.original.Date),
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
];
