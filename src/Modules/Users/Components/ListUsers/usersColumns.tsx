import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../Models/User";
import { Edit2 } from "lucide-react";
import DeleteUserButton from "./DeleteUserButton";


export type RowUser = User & {
  Id: number;
  IsActive?: boolean;
};

export const usersColumns = (
  onEdit: (userEdit: User) => void,
): ColumnDef<User>[] => [
  { accessorKey: "Name", header: "Nombre Completo", 
    cell: ({ row }) => (row.original.Name + " " + row.original.Surname1 + " " + row.original.Surname2),
  },
  { accessorKey: "Nis", header: "Nis" },
  { accessorKey: "IDcard", header: "Cédula" },
  { accessorKey: "Email", header: "Correo" },
  { accessorKey: "PhoneNumber", header: "Teléfono" },
  { accessorKey: "IsActive", header: "Estado",
    cell: ({ row }) => (row.original.IsActive ? "Activo" : "Inactivo"),
  },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
              text-[#1789FC] border-[#1789FC]
              hover:bg-[#1789FC] hover:text-[#F9F5FF] transition"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          <DeleteUserButton userSelected={user} />
        </div>
      );
    },
  },
];
