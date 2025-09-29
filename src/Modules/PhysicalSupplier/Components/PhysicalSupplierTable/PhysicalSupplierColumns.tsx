import type { ColumnDef } from "@tanstack/react-table";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";
import { Edit2, Trash } from "lucide-react";

export const PhysicalSupplierColumns = (
  onEdit: (physicalSupplier: PhysicalSupplier) => void,
  onDelete: (physicalSupplier: PhysicalSupplier) => void,
  onGetInfo? :  (physicalSupplier : PhysicalSupplier) => void,
//   onGetInfo: (product: Product) => void
): ColumnDef<PhysicalSupplier>[] => [
  {
    accessorKey: "IDcard",
    header: "Número de Cédula",
  },  
  {
    accessorKey: "Name",
    header: "Nombre",
  },
  {
    accessorKey: "Email",
    header: "Correo electrónico",
  },
  {
    accessorKey: "PhoneNumber",
    header: "Número de Teléfono",
  },
  {
    accessorKey: "Location",
    header : "Ubicación",
  },
  {
    id: 'Acciones',
    header: 'Acciones',
    cell: ({row}) =>{
      const supplier = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(supplier)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                       text-[#1789FC] border-[#1789FC]
                       hover:bg-[#1789FC] hover:text-[#F9F5FF] transition"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
           <button
            onClick={() => onDelete(supplier)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                       text-[#F6132D] border-[#F6132D]
                       hover:bg-[#F6132D] hover:text-[#F9F5FF] transition"
          >
            <Trash className="w-4 h-4" />
            Editar
          </button>
        </div>
      );
    }
  },

];

