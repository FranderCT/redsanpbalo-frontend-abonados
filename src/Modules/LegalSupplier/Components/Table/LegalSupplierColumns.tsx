import type { ColumnDef } from "@tanstack/react-table";
import type { LegalSupplier } from "../../Models/LegalSupplier";


export const LegalSupplierColumns = (
  onEdit?: (legalSupplier: LegalSupplier) => void,
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
    accessorKey: "Location",
    header : "Ubicación",
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