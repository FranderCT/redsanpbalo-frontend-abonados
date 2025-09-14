import type { ColumnDef } from "@tanstack/react-table";
import { Edit2} from "lucide-react";
import DeleteMaterialButton from "../ModalsMaterial/DeleteMaterialModal";
import type { Material } from "../../Models/Material";


export type RowMaterial = Material & {
  Id: number;
  IsActive?: boolean;
};

export const MaterialColumns = (
  onEdit: (materialEdit: Material) => void,
): ColumnDef<Material>[] => [
  { accessorKey: "Name", header: "Nombre del material" },
  { accessorKey: "IsActive", header: "Estado",  
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
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
              text-[#1789FC] border-[#1789FC]
              hover:bg-[#1789FC] hover:text-[#F9F5FF] transition0"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          <DeleteMaterialButton materialSelected={material} />
        </div>
      );
    },
  },
];
