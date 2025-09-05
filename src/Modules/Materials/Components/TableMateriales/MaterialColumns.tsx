// Modules/Materials/MaterialColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Material } from "../../Models/Material";

export const MaterialColumns = (
  onEdit: (material: Material) => void,
  onDelete: (id: number) => void
): ColumnDef<Material>[] => [
  { accessorKey: "Name", header: "Nombre del Material" },
  { accessorKey: "Description", header: "Descripción" },
  {
    accessorKey: "IsActive",
    header: "Estatus",
    cell: ({ row }) => (row.original.IsActive ? "Activo" : "Inactivo"),
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const material = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(material)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(material.Id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      );
    },
  },
];
