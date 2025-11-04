import type { ColumnDef } from "@tanstack/react-table";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";
import { Edit2, InfoIcon } from "lucide-react";
import DeletePhysicalSupplierModal from "../Modals/DeletePhysicalSupplierModal";

export const PhysicalSupplierColumns = (
  onEdit: (physicalSupplier: PhysicalSupplier) => void,
  //onDelete: (physicalSupplier: PhysicalSupplier) => void,
  onGetInfo :  (physicalSupplier : PhysicalSupplier) => void,
//   onGetInfo: (product: Product) => void
): ColumnDef<PhysicalSupplier>[] => [
  {
    accessorKey: "IDcard",
    header: "Número de Cédula",
  },  
  { accessorKey: "Name", header: "Nombre Completo", 
    cell: ({ row }) => (row.original.Name + " " + row.original.Surname1 + " " + row.original.Surname2),
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

          {/* Desactivar */}
          <DeletePhysicalSupplierModal supplier={supplier} />
        </div>
      );
    }
  },
  {
    id : "Información",
    header : "Información",
    cell : ({row}) => {
      const supplier = row.original;
      return(
        <button
          onClick={() => onGetInfo(supplier)}
          className="flex items-center gap-1 px-3 py-1 text-xs font-medium border
            text-[#222] border-[#222]
            hover:bg-[#091540] hover:text-[#f5f5f5] transtion cursor-pointer 
          "
        >
          <InfoIcon className="w-4 h-4" />
          Ver info
        </button>
      );
    }
  },

];

