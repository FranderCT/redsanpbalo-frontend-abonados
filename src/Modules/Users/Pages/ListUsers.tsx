import { useMemo, useState } from "react";
import UsersTable from "../Components/ListUsers/UsersTables";

import { useGetAllUsersPaginate } from "../Hooks/UsersHooks";
import type { Users } from "../Models/Users";
import DeleteUserModal from "../Components/ListUsersModals/DeleteUserModal";
import EditUserModal from "../Components/ListUsersModals/EditUserModal";
import GetInfoUserModal from "../Components/ListUsersModals/GetInfoUserModal";

const ListUsers = () => {
  // Filtros + paginación (server-side)
  const [name, setName] = useState<string>("");
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const params = useMemo(
    () => ({ page, limit, name: name || undefined, roleId }),
    [page, limit, name, roleId]
  );

  const { usersProfiles, meta, isPending, error, refetch } = useGetAllUsersPaginate(params);

  // Estado de modales
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [infoUser, setInfoUser] = useState<Users | null>(null);
  const [removeUser, setRemoveUser] = useState<Users | null>(null);

  const onEdit = (u: Users) => setEditingUser(u);
  const onGetInfo = (u: Users) => setInfoUser(u);
  const onDelete = (u: Users) => setRemoveUser(u);

  const pageCount = meta?.pageCount ?? 1;
  const currentPage = meta?.page ?? page;
  const total = meta?.total ?? 0;

  const resetPageOnFilter = () => setPage(1);

  if (isPending) return <p>Cargando...</p>;
  if (error) return <p>Ocurrió un error cargando usuarios</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-[#091540]">Lista de Usuarios</h2>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 p-3">
        <label className="grid text-sm">
          <span className="mb-1">Nombre </span>
          <input
            className="border rounded px-3 py-2 w-56"
            placeholder="Ej: frander"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              resetPageOnFilter();
            }}
          />
        </label>

        <label className="grid text-sm">
          <span className="mb-1">Rol (roleId)</span>
          <input
            className="border rounded px-3 py-2 w-28"
            type="number"
            value={roleId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setRoleId(v === "" ? undefined : Number(v));
              resetPageOnFilter();
            }}
          />
        </label>

        <label className="grid text-sm">
          <span className="mb-1">Por página</span>
          <select
            className="border  px-3 py-2 w-28"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              resetPageOnFilter();
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            setName("");
            setRoleId(undefined);
            resetPageOnFilter();
          }}
          className="h-10 px-4 = border text-sm text-[#091540] hover:bg-gray-100"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Resumen */}
      <div className="text-sm text-gray-600">
        {total > 0 ? `Total: ${total} registros` : "Sin resultados"}
      </div>

      {/* Tabla */}
      <UsersTable
        data={usersProfiles ?? []}
        onEdit={onEdit}
        onGetInfo={onGetInfo}
        onDelete={onDelete}
      />

      {/* Paginación */}
      <div className="flex items-center gap-2  justify-center">
        <button
          className="border px-3 py-1  disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
        >
          ← Anterior
        </button>
        <span className="text-sm">
          Página {currentPage} de {pageCount}
        </span>
        <button
          className="border px-3 py-1  disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={currentPage >= pageCount}
        >
          Siguiente →
        </button>
      </div>

      {/* Modales */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          open
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            refetch();
          }}
        />
      )}

      {infoUser && (
        <GetInfoUserModal
          user={infoUser}
          open
          onClose={() => setInfoUser(null)}
          onSuccess={() => {
            setInfoUser(null);
            refetch();
          }}
        />
      )}

      {removeUser && (
        <DeleteUserModal
          user={removeUser}
          open
          onClose={() => setRemoveUser(null)}
          onSuccess={() => {
            setRemoveUser(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ListUsers;
