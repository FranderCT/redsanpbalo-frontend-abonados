// Modules/Materials/MaterialColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "../Models/Category";


export const CategoryColumns = (
  onEdit: (category: Category) => void,
  onDelete: (id: number) => void
): ColumnDef<Category>[] => [
  { accessorKey: "Name", header: "Nombre de la Categoría" },
  { accessorKey: "Description", header: "Descripción" },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(category.Id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      );
    },
  },
];
