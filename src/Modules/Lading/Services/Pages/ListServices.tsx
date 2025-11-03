import { useMemo, useState } from "react";
import { useSearchServices } from "../Hooks/ServicesHooks";
import type { Service } from "../Models/Services";
import ServiceHeaderBar from "../Components/PaginationServices/ServiceHeaderBar";
import CreateServiceModal from "../Components/ModalsServices/CreateServiceModal";
import ServiceTable from "../Components/TableServices/ServiceTable";

export default function ListServices() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setTitle(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
    setState(newState || undefined);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setTitle(undefined);
    setState(undefined);
    setPage(1);
  };

  // Construir parámetros para la búsqueda
  const params = useMemo(() => ({ page, limit, title, state }), [page, limit, title, state]);
  const { data, isLoading, error } = useSearchServices(params);

  const rows: Service[] = data?.data ?? [];
  const meta = data?.meta ?? {
    total: 0,
    page: 1,
    limit,
    pageCount: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Servicios</h1>
      <p className="text-[#091540]/70 text-md">
        Gestione todos los servicios ofrecidos
      </p>
      <div className="border-b border-dashed border-gray-300 mb-8"></div>

      <ServiceHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        state={state}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onFilterClick={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateServiceModal />}
      />

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Ocurrió un error al cargar los servicios.
          </div>
        ) : (
          <ServiceTable
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
