import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UsersTable from "../Components/ListUsers/UsersTables";

import { useGetAllUsersPaginate } from "../Hooks/UsersHooks";
import type { Users } from "../Models/Users";
import DeleteUserModal from "../Components/ListUsersModals/DeleteUserModal";
import EditUserModal from "../Components/ListUsersModals/EditUserModal";
import GetInfoUserModal from "../Components/ListUsersModals/GetInfoUserModal";
import { getAllRoles } from "../Services/UsersServices";

const ListUsers = () => {
  // Filtros + paginación (server-side)
  const [name, setName] = useState<string>("");
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const [roleName, setRoleName] = useState<string>(""); // visible
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  // Traer roles para el select
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["roles", "all"],
    queryFn: getAllRoles, // debe devolver Roles[]
    staleTime: 5 * 60 * 1000,
  });

  // Derivar roleId a partir del nombre visible
  const selectedRoleId = useMemo(() => {
    if (!roleName) return undefined;
    const found = roles.find((r) => r.Rolname === roleName);
    return found?.Id;
  }, [roleName, roles]);

  // ✅ sincronizar roleId de forma segura (no durante render)
  useEffect(() => {
    setRoleId(selectedRoleId);
  }, [selectedRoleId]);

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
          <span className="mb-1">Nombre</span>
          <input
            className="border px-3 py-2 w-56"
            placeholder="Ej: José Daniel Román"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              resetPageOnFilter();
            }}
          />
        </label>

        <label className="grid text-sm">
          <span className="mb-1">Rol</span>
          <select
            className="border px-3 py-2 w-56"
            value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
              resetPageOnFilter();
            }}
            disabled={rolesLoading}
          >
            <option value="">Todos</option>
            {roles.map((r) => (
              <option key={r.Id} value={r.Rolname}>
                {r.Rolname}
              </option>
            ))}
          </select>
        </label>

        <label className="grid text-sm">
          <span className="mb-1">Por página</span>
          <select
            className="border px-3 py-2 w-28"
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
            setRoleName("");
            setRoleId(undefined);
            resetPageOnFilter();
          }}
          className="h-10 px-4 border text-sm text-[#091540] hover:bg-gray-100"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Tabla con paginación incrustada */}
      <UsersTable
        data={usersProfiles ?? []}
        onEdit={onEdit}
        onGetInfo={onGetInfo}
        onDelete={onDelete}
        total={total}
        page={currentPage}
        pageCount={pageCount}
        onPageChange={setPage}
      />

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
