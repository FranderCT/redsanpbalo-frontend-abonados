import { type ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import type { ReqSupervisionMeter } from "../../Models/ReqSupervisionMeter";
import DeleteSupervisionMeterModal from "../../Modals/DeleteReqSupervisionMeterModal";

// ---- helpers ----
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
  "pendiente": "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20", // azul suave
  "en proceso": "bg-[#E9F2FF] text-[#1789FC] border border-[#1789FC]/20",
  "aprobado": "bg-[#E8F8F0] text-[#068A53] border border-[#68D89B]/30", // verde menta
  "rechazado": "bg-[#FFE8E8] text-[#F6132D] border border-[#F6132D]/30", // rojo claro
  "finalizado": "bg-[#F9F5FF] text-[#091540] border border-[#091540]/20",
};

// Fallback por coincidencias
const guessStateColor = (normalized: string) => {
  if (stateColorsDict[normalized]) return stateColorsDict[normalized];
  if (normalized.includes("aproba")) return stateColorsDict["aprobado"];
  if (normalized.includes("rechaz")) return stateColorsDict["rechazado"];
  if (normalized.includes("pend") || normalized.includes("proce"))
    return stateColorsDict["pendiente"];
};
export const ReqSupervisionMeterColumns = (
  onEdit: (req: ReqSupervisionMeter) => void
  // onGetInfo?: (req: ReqAvailWater) => void
): ColumnDef<ReqSupervisionMeter>[] => [
  {
    id: "Name",
    header: "Nombre del Solicitante",
    cell: ({ row }) =>   `${row.original.User?.Name ?? ""} ${row.original.User?.Surname1 ?? ""} ${row.original.User?.Surname2 ?? ""}`.trim() ||
      "-",
  },
  {
    id: "NIS",
    header: "NIS",
    cell: ({ row }) =>   row.original.NIS ??
      "-",
  },
  {
    id: "Address",
    header: "Dirección supervisión medidor",
    cell: ({ row }) => row.original.Location ?? "-",
  },
  {
    id: "Date",
    header: "Fecha Solicitud",
    cell: ({ row }) => row.original.Date ?? "-",
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
            className={`min-w-[90px] px-3 py-1.5  text-sm  tracking-wide uppercase ${colorClass}`}
          >
            {raw}
          </span>
        </div>
      );
    },
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const req = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(req)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                      text-[#1789FC] border-[#1789FC]
                      hover:bg-[#1789FC] hover:text-white transition"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          <DeleteSupervisionMeterModal reqSupervisionMeter={req} /> 
        </div>
      );
    },
  },
  // Si agregas botón de info, descomenta y pasa onGetInfo arriba:
  // {
  //   id: "Información",
  //   header: "Información",
  //   cell: ({ row }) => {
  //     const req = row.original;
  //     return (
  //       <button
  //         onClick={() => onGetInfo?.(req)}
  //         className="flex items-center gap-1 px-3 py-1 text-xs font-medium border
  //                    text-[#222] border-[#222]
  //                    hover:bg-[#091540] hover:text-white transition"
  //       >
  //         <InfoIcon className="w-4 h-4" />
  //         Ver info
  //       </button>
  //     );
  //   },
  // },
];
