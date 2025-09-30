import type { ColumnDef } from "@tanstack/react-table";
import type { LegalSupplier } from "../../Models/LegalSupplier";
import { Edit2 } from "lucide-react";


export const LegalSupplierColumns = (
  onEdit: (legalSupplier: LegalSupplier) => void,
  onGetInfo? :  (legalSupplier : LegalSupplier) => void
//   onGetInfo: (product: Product) => void
): ColumnDef<LegalSupplier>[] => [
  {
    accessorKey: "LegalID",
    header: "Número de Cédula Jurídica",
  },  
  {
    accessorKey: "CompanyName",
    header: "Nombre",
  },
  {
    accessorKey: "Email",
    header: "Correo electrónico",
  },
  {
    accessorKey: "PhoneNumber",
    header: "Número de teléfono",
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
        </div>
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