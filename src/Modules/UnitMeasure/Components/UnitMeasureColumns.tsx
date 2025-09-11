// Modules/Materials/MaterialColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Unit } from "../Models/unit";
import { Edit2, Trash } from "lucide-react";


export const UnitMeasureColumns = (
  onEdit: (unit: Unit) => void,
  onDelete: (unit: Unit) => void
): ColumnDef<Unit>[] => [
  { accessorKey: "Name", header: "Nombre de la Unidad de Medida" },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const unit = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(unit)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                       text-[#1789FC] border-[#1789FC]
                       hover:bg-[#1789FC] hover:text-[#F9F5FF] transition"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onDelete(unit)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                       text-[#F6132D] border-[#F6132D]
                       hover:bg-[#F6132D] hover:text-[#F9F5FF] transition"
          >
            <Trash className="w-4 h-4" />
            Desactivar
          </button>
        </div>
      );
    },
  },
];
