import type { ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import type { Service } from "../../Models/Services";
import DeleteServiceButton from "../ModalsServices/DeleteServiceModal";

export const ServiceColumns = (
  onEdit: (service: Service) => void,
): ColumnDef<Service>[] => [
  { 
    accessorKey: "Icon", 
    header: "Icono",
    cell: ({ row }) => (
      <div className="w-10 h-10">
        <img 
          src={row.original.Icon} 
          alt="icon" 
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ddd"/><text x="50%" y="50%" font-size="12" text-anchor="middle" dy=".3em">?</text></svg>';
          }}
        />
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
