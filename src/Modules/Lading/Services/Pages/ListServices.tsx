import { useDeferredValue, useMemo, useState } from "react";
import { useSearchServices } from "../Hooks/ServicesHooks";
import type { Service } from "../Models/Services";
import ServiceHeaderBar from "../Components/PaginationServices/ServiceHeaderBar";
import CreateServiceModal from "../Components/ModalsServices/CreateServiceModal";
import ServiceCards from "../Components/ServiceCards";

export default function ListServices() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<string | undefined>(undefined);
  const deferredSearch = useDeferredValue(search);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
    setState(newState || undefined);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setState(undefined);
    setPage(1);
  };

  // Construir parámetros para la búsqueda
  const params = useMemo(
    () => ({
      page,
      limit,
      title: deferredSearch.trim() || undefined,
      state,
    }),
    [deferredSearch, limit, page, state],
  );
  const { data, isLoading, error } = useSearchServices(params);

  const rows: Service[] = data?.data ?? [];
  const meta = data?.meta ?? {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: limit,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#091540]">Lista de Servicios</h1>
        <p className="text-md text-[#091540]/70">
          Gestione todos los servicios ofrecidos desde una vista simple y enfocada en acciones.
        </p>
      </section>

      <ServiceHeaderBar
        limit={meta.itemsPerPage}
        total={meta.totalItems}
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

      <div className="flex flex-col">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Cargando servicios...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Ocurrió un error al cargar los servicios.
          </div>
        ) : (
          <ServiceCards
            data={rows}
            total={meta.totalItems}
            page={meta.currentPage}
            pageCount={meta.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
