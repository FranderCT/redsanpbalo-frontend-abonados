import type { ColumnDef } from "@tanstack/react-table";
import type { Material } from "../../Models/Material";
import DeleteMaterialButton from "../../Modals/DeleteMaterialModal";

// Tipo de fila extendido para la UI (NO cambia tu modelo base)
export type RowMaterial = Material & {
  Id: number;
  IsActive?: boolean;
};

export const MaterialColumns = (
  onEdit: (material: RowMaterial) => void
): ColumnDef<RowMaterial>[] => [
  { accessorKey: "Name", header: "Nombre del Material" },
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
            type="button"
            onClick={() => onEdit(material)}
            className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600"
          >
            Editar
          </button>
          <DeleteMaterialButton material={material} />
        </div>
      );
    },
  },
];
