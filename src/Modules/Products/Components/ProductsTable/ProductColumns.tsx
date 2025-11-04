import { type ColumnDef } from "@tanstack/react-table";

import { Edit2, InfoIcon } from "lucide-react";
import type { Product } from "../../Models/CreateProduct";
import DeleteProductButton from "../Modals/DeleteProductModal";

export const ProductColumns = (
  onEdit: (product: Product) => void,
  onGetInfo :  (product : Product) => void
//   onGetInfo: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "Name",
    header: "Nombre",
  },
  
  {
    id: "Category",
    header: "Categoría",
    cell: ({ row }) => row.original.Category?.Name ?? "-",
  },
  {
    id: "Material",
    header: "Material",
    cell: ({ row }) => row.original.Material?.Name ?? "-",
  },
  {
    id: "UnitMeasure",
    header: "Unidad de medida",
    cell: ({ row }) => row.original.UnitMeasure?.Name ?? "-",
  },
  {
    id: "Supplier",
    header : "Proveedor",
    cell: ({ row }) => row.original.PhysicalSupplier?.Name ?? row.original.LegalSupplier.CompanyName,
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex gap-2">
          {/* Editar */}
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                        text-[#1789FC] border-[#1789FC]
                        hover:bg-[#1789FC] hover:text-[#F9F5FF] transition"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          {/* Desactivar */}
          <DeleteProductButton product={product} />

          {/* <button
            onClick={() => onDelete(product)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                        text-[#F6132D] border-[#F6132D]
                        hover:bg-[#F6132D] hover:text-[#F9F5FF] transition"
          >
            <Trash className="w-4 h-4" />
            Desactivar
          </button> */}
        </div>
      );
    },
  },
//   {
//     id: "Información",
//     header: "Información",
//     cell: ({ row }) => {
//       const product = row.original;
//       return (
//         <button
//           onClick={() => onGetInfo(product)}
//           className="flex items-center gap-1 px-3 py-1 text-xs font-medium 
//                      text-[#091540] border-[#091540]
//                      hover:bg-[#091540] hover:text-[#F9F5FF] transition"
//         >
//           <Info className="w-4 h-4" />
//           Ver más...
//         </button>
//       );
//     },
//   },
{
    id : "Información",
    header : "Información",
    cell : ({row}) => {
      const product = row.original;
      return(
        <button
          onClick={() => onGetInfo(product)}
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
