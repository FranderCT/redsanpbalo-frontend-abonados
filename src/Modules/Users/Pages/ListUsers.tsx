import { useMemo, useState } from "react";
import UsersTable from "../Components/ListUsers/UsersTables";
import type { User } from "../Models/User";
import RegisterAbonadosModal from "../Components/ListUsersModals/AddUserModal";
import { BrushCleaning } from "lucide-react";
import { useGetAllUsersPaginate } from "../Hooks/UsersHooks";


export default function ListUsers() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [name, setName] = useState<string | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setName(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleLimitChange = (l: number) => {
    setLimit(l);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setName(undefined);
    setPage(1);
  };

  const params = useMemo(() => ({ page, limit, name }), [page, limit, name]);
  const { data, isLoading, error } = useGetAllUsersPaginate(params);

  const rows: User[] = data?.data ?? [];
  const meta = data?.meta ?? {
    total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false,
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Usuarios</h1>
      <p className="text-[#091540]/70 text-md">Gestione todos los usuarios</p>
      <div className="border-b border-dashed border-gray-300 mb-8"></div>

      <div className="flex flex-wrap items-end justify-between gap-3 p-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid text-sm">
            <span className="mb-1">Nombre</span>
            <input
              className="border px-3 py-2 w-56"
              placeholder="Ej: José Daniel Román"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </label>
          <label className="grid text-sm">
            <span className="mb-1">Por página</span>
            <select
              className="border px-3 py-2 w-28"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-row gap-3">
          <button
            type="button"
            onClick={handleCleanFilters}
            className="flex items-center gap-1 h-10 px-3 border text-sm text-[#091540] hover:bg-gray-100"
          >
            <BrushCleaning />
            <span className="hidden sm:inline">Limpiar filtros</span>
          </button>
          <RegisterAbonadosModal />
        </div>
      </div>

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Ocurrió un error al cargar los Usuarios.</div>
        ) : (
          <UsersTable
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
