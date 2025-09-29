import type { ColumnDef } from "@tanstack/react-table";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";

export const PhysicalSupplierColumns = (
  onEdit?: (physicalSupplier: PhysicalSupplier) => void,
  onGetInfo? :  (physicalSupplier : PhysicalSupplier) => void
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

];

