import type { ColumnDef } from "@tanstack/react-table";
import type { LegalSupplier } from "../../Models/LegalSupplier";
import { Edit2, HatGlasses, InfoIcon } from "lucide-react";
import DeleteLegalSupplierModal from "../Modals/DeleteLegalSupplierModal";


export const LegalSupplierColumns = (
  onEdit: (legalSupplier: LegalSupplier) => void,
  onGetInfo :  (legalSupplier : LegalSupplier) => void,
  onAgents :  (id : number) => void
//   onGetInfo: (product: Product) => void
): ColumnDef<LegalSupplier>[] => [
  {
    accessorKey: "Supplier.IDcard",
    header: "Número de Cédula Jurídica",
    cell: ({ row }) => row.original.Supplier?.IDcard || "N/A",
  },  
  {
    accessorKey: "Supplier.Name",
    header: "Nombre",
    cell: ({ row }) => row.original.Supplier?.Name || "N/A",
  },
  {
    accessorKey: "Supplier.Email",
    header: "Correo electrónico",
    cell: ({ row }) => row.original.Supplier?.Email || "N/A",
  },
  {
    accessorKey: "Supplier.PhoneNumber",
    header: "Número de teléfono",
    cell: ({ row }) => row.original.Supplier?.PhoneNumber || "N/A",
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
          <DeleteLegalSupplierModal legalsupplier={supplier} />
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
  {
    id : "Agentes",
    header : "Gestión agentes",
    cell : ({row}) => {
      const supplier = row.original;
      return(
        <button
          onClick={() => onAgents(supplier.Id)}
          className="flex items-center gap-1 px-3 py-1 text-xs font-medium border
            text-[#222] border-[#222]
            hover:bg-[#091540] hover:text-[#f5f5f5] transtion cursor-pointer 
          "
        >
          <HatGlasses className="w-4 h-4" />
          Agentes
        </button>
      );
    }
  },
];


// export interface LegalSupplier{
//     Id : number;
//     LegalID: string;
//     CompanyName : string;
//     Name : string;
//     Email : string;
//     PhoneNumber: string;
//     Location: string;
//     WebSite: string;
// }