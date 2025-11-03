import type { ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import type { Service } from "../../Models/Services";
import DeleteServiceButton from "../ModalsServices/DeleteServiceModal";

// Usa las clases CSS tipo "icon-<name>" para renderizar el ícono (igual que en Services.tsx)
const iconClassFor = (name?: string) => `icon-${(name ?? "droplets").toLowerCase()}`;

export const ServiceColumns = (
  onEdit: (service: Service) => void,
): ColumnDef<Service>[] => [
  { 
    accessorKey: "Icon", 
    header: "Icono",
    cell: ({ row }) => (
      <div className="w-10 h-10 flex items-center justify-center">
        {/* Render un <i> con la clase del ícono de lucide mapeada, mismo patrón que Services.tsx */}
        <i className={`${iconClassFor(row.original.Icon)} text-3xl leading-none`} />
      </div>
    )
  },
  { 
    accessorKey: "Title", 
    header: "Título",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.Title}
      </div>
    )
  },
  { 
    accessorKey: "Description", 
    header: "Descripción",
    cell: ({ row }) => (
      <div className="max-w-lg text-sm text-gray-600">
        {row.original.Description}
      </div>
    )
  },
  { 
    accessorKey: "IsActive", 
    header: "Estado",  
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        row.original.IsActive 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800"
      }`}>
        {row.original.IsActive ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(service)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
              text-[#1789FC] border-[#1789FC]
              hover:bg-[#1789FC] hover:text-white transition"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          <DeleteServiceButton serviceSelected={service} />
        </div>
      );
    },
  },
];
