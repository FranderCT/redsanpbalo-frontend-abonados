import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../Models/User";
import { Edit2, Info, InfoIcon } from "lucide-react";
import DeleteUserButton from "./DeleteUserButton";


export const usersColumns = (
  onEdit: (userEdit: User) => void,
  onGetInfo: (user : User) => void
): ColumnDef<User>[] => [
  { accessorKey: "Name", header: "Nombre Completo", 
    cell: ({ row }) => (row.original.Name + " " + row.original.Surname1 + " " + row.original.Surname2),
  },
  { accessorKey: "Nis", header: "Nis" },
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
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border 
              text-[#1789FC] border-[#1789FC]
              hover:bg-[#1789FC] hover:text-[#F9F5FF] transition cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          <DeleteUserButton userSelected={user} />
        </div>
      );
    },
  },
  {
    id : "Información",
    header : "Información",
    cell : ({row}) => {
      const user = row.original;
      return(
        <button
          onClick={() => onGetInfo(user)}
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
