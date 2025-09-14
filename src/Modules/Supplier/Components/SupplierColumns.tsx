import type { ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import type { Supplier } from "../Models/Supplier";
import DeleteSupplierButton from "./DeleteSupplierButton";

export type RowSupplier = Supplier & {
  Id: number;
  IsActive?: boolean;
};

export const SupplierColumns = (
  onEdit: (supplierEdit: Supplier) => void,  // Recibe la función para editar proveedor
): ColumnDef<Supplier>[] => [
  {
    accessorKey: "Name",  // Columna para el nombre del proveedor
    header: "Nombre del Proveedor",
  },
  {
    accessorKey: "IsActive",  // Columna para el estado de la actividad
    header: "Estado",
    cell: ({ row }) => (row.original.IsActive ? "Activo" : "Inactivo"),  // Muestra si el proveedor está activo o inactivo
  },
  {
    accessorKey: "Email",
    header: "Correo Electrónico"
  },
  {
    accessorKey: "PhoneNumber",
    header: "Correo Electrónico"
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const supplier = row.original;
      return (
        <div className="flex gap-2">
          {/* Botón para editar proveedor */}
          <button
            onClick={() => onEdit(supplier)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                       text-[#1789FC] border-[#1789FC]
                       hover:bg-[#1789FC] hover:text-[#F9F5FF] transition"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          {/* Botón para eliminar/inhabilitar proveedor */}
         <DeleteSupplierButton supplierSelected={supplier} onClose={() => {}} />  {/* Componente para eliminar el proveedor */}
          
          {/* Si deseas agregar la funcionalidad para eliminar, descomenta el siguiente código */}
          {/* 
          <button
            onClick={() => onDelete(supplier.Id)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
                       text-[#F6132D] border-[#F6132D]
                       hover:bg-[#F6132D] hover:text-[#F9F5FF] transition"
          >
            <Trash className="w-4 h-4" />
            Inhabilitar
          </button> 
          */}
        </div>
      );
    },
  },
];
