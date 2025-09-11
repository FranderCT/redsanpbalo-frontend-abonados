import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "../../Models/Category";
import { Edit2, Trash} from "lucide-react";
import DeleteCategoryButton from "../ModalsCategory/DeleteCategoryModal";

export type RowCategory = Category & {
  Id: number;
  IsActive?: boolean;
};

export const CategoryColumns = (
  onEdit: (categoryEdit: Category) => void,
): ColumnDef<Category>[] => [
  { accessorKey: "Name", header: "Nombre de la Categoría" },
  { accessorKey: "Description", header: "Descripción" },
  { accessorKey: "IsActive", header: "Estado",  
    cell: ({ row }) => (row.original.IsActive ? "Activo" : "Inactivo"),
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                       text-[#1789FC] border-[#1789FC]
                       hover:bg-[#1789FC] hover:text-[#F9F5FF] transition0"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          <DeleteCategoryButton categorySelected={category} />
          {/* <button
            onClick={() => onDelete(category.Id)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                       text-[#F6132D] border-[#F6132D]
                       hover:bg-[#F6132D] hover:text-[#F9F5FF] transition"
          >
            <Trash className="w-4 h-4" />
            Inhabilitar
          </button> */}
        </div>
      );
    },
  },
];
