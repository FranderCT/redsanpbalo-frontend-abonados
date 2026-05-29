import { useMemo, useState } from "react";
import UsersCards from "../Components/ListUsers/UsersCards";
import type { User } from "../Models/User";
import RegisterAbonadosModal from "../Components/ListUsersModals/AddUserModal";
import { useGetAllUsersPaginate } from "../Hooks/UsersHooks";
import UserHeaderBar from "../Components/Pagination/UserHeaderBar";
import { Can } from "../../Auth/Components/Can";
import { Role } from "../Models/Roles";


export default function ListUsers() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [name, setName] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setName(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
    setState(newState || undefined);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setName(undefined);
    setState(undefined);
    setPage(1);
  };

  const params = useMemo(() => ({ page, limit, name, state }), [page, limit, name, state]);
  const { data, isLoading, error } = useGetAllUsersPaginate(params);

  const rows: User[] = data?.data ?? [];
  const rawMeta = data?.meta;
  const meta = {
    limit: rawMeta?.limit ?? limit,
    total: rawMeta?.total ?? 0,
    page: rawMeta?.page ?? page,
    pageCount: rawMeta?.pageCount ?? 1,
    hasNextPage: rawMeta?.hasNextPage ?? false,
    hasPrevPage: rawMeta?.hasPrevPage ?? false,
  };

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden p-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Usuarios</h1>
      <p className="text-[#091540]/70 text-md">Gestione todos los usuarios</p>
      <div className="border-b border-dashed border-gray-300 mb-8"></div>

    <UserHeaderBar
      limit={meta.limit}
      total={meta.total}
      search={search}
      state={state}
      onLimitChange={(l) => { setLimit(l); setPage(1); }}
      onFilterClick={handleStateChange}
      onSearchChange={handleSearchChange}
      onCleanFilters={handleCleanFilters}
      rightAction={<Can rule={{ none: [Role.BOD] }}><RegisterAbonadosModal /></Can>}
    />

      <div className="">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Ocurrió un error al cargar los Usuarios.</div>
        ) : (
          <UsersCards
            data={rows}
            total={meta.total}
            page={meta.page}
            pageCount={meta.pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
