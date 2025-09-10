import { type ColumnDef } from "@tanstack/react-table";
import type { Users } from "../../Models/Users";
import { Edit2, Trash, Info } from "lucide-react";

export const usersColumns = (
  onEdit: (user: Users) => void,
  onDelete: (user: Users) => void,
  onGetInfo: (user: Users) => void
): ColumnDef<Users>[] => [
  {
    id: "FullName",
    header: "Nombre completo",
    cell: ({ row }) => {
      const { Name, Surname1, Surname2 } = row.original;
      return `${Name} ${Surname1} ${Surname2}`;
    },
  },
  { accessorKey: "Nis", header: "Nis" },
  { accessorKey: "IDcard", header: "Cédula" },
  { accessorKey: "Email", header: "Correo" },
  { accessorKey: "PhoneNumber", header: "Teléfono" },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium   text-[#1789FC] hover:bg-[#091540] transition border"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onDelete(user)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium hover:bg-[#091540] transition text-[#F6132D] border"
          >
            <Trash className="w-4 h-4" />
            Desactivar
          </button>
        </div>
      );
    },
  },
  {
    id: "Información",
    header: "Información",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <button
          onClick={() => onGetInfo(user)}
          className="flex items-center gap-1 px-3 py-1 text-xs font-medium   text-[#091540] hover:bg-[#091540] hover:text-[#F9F5FF] transition "
        >
          <Info className="w-4 h-4"/>
          Ver más...
        </button>
      );
    },
  },
];
