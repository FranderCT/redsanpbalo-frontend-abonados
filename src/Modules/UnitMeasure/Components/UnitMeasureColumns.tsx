// Modules/Materials/MaterialColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Unit } from "../Models/unit";


export const UnitMeasureColumns = (
  onEdit: (unit: Unit) => void,
  onDelete: (id: number) => void
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
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(unit.Id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      );
    },
  },
];
