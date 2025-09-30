import type { ColumnDef } from "@tanstack/react-table";
import { Edit2} from "lucide-react";
import type { Unit } from "../../Models/unit";
import DeleteUnitButton from "../UnitsModal/DeleteUnitMeasureModal";


export type RowUnit = Unit & {
  Id: number;
  IsActive?: boolean;
};

export const UnitMeasureColumns = (
  onEdit: (unitEdit: Unit) => void,
): ColumnDef<Unit>[] => [
  { accessorKey: "Name", header: "Nombre de la unidad de medida" },
  { accessorKey: "IsActive", header: "Estado",  
    cell: ({ row }) => (row.original.IsActive ? "Activo" : "Inactivo"),
  },
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
                       hover:bg-[#1789FC] hover:text-[#F9F5FF] transition0"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          <DeleteUnitButton unitSelected={unit} />
        </div>
      );
    },
  },
];
