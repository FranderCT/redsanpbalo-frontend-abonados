import { type ColumnDef } from "@tanstack/react-table";
import type { Users } from "../../Models/Users";


export const usersColumns = (
  onEdit: (id: number) => void,
  onDelete: (id: number) => void
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
    accessorKey: "Roles",
    header: "Roles",
    cell: ({ row }) =>
      row.original.Roles.map((r) => r.Rolname).join(", ") || "Sin rol",
  },
  {
    accessorKey: "IsActive",
    header: "Estatus",
    cell: ({ row }) => (row.original.IsActive ? "Activo" : "Inactivo"),
  },
  { accessorKey: "Address", header: "Dirección" },
  {
    id: "Acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user.Id)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(user.Id) }
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      );
    },
  },
];
// se definen las columnas de la tabla para usuasrios 