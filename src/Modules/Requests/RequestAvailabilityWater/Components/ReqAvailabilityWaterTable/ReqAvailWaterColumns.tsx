import { type ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import type { ReqAvailWater } from "../../Models/ReqAvailWater";

export const ReqAvailWaterColumns = (
  onEdit: (req: ReqAvailWater) => void
  // onGetInfo?: (req: ReqAvailWater) => void
): ColumnDef<ReqAvailWater>[] => [
  {
    id: "Name",
    header: "Nombre del Solicitante",
    cell: ({ row }) => row.original.User?.Name +' '+ row.original.User?.Surname1 + ' ' + row.original.User?.Surname2 ?? "-",
  },
  {
    id: "Address",
    header: "Dirección del Solicitante",
    cell: ({ row }) => row.original.User?.Address ?? "-",
  },
  {
    id: "Date",
    header: "Fecha Solicitud",
    cell: ({ row }) => row.original.Date ?? "-",
  },
  {
    id: "Justification",
    header: "Justificación",
    cell: ({ row }) => row.original.Justification ?? "-",
  },
  {
    id: "RequestState",
    header: "Estado",
    cell: ({ row }) => row.original.StateRequest?.Name ?? "-",
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
