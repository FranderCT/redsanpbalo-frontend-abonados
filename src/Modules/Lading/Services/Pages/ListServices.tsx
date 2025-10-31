import { useState } from "react";
import { useGetAllServices } from "../Hooks/ServicesHooks";
import type { Service } from "../Models/Services";
import ServiceHeaderBar from "../Components/PaginationServices/ServiceHeaderBar";
import CreateServiceModal from "../Components/ModalsServices/CreateServiceModal";
import ServiceTable from "../Components/TableServices/ServiceTable";

export default function ListServices() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<string | undefined>(undefined);

  const { services, isPending: isLoading, error } = useGetAllServices();

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

  // Filtrado local
  let filteredServices = services ?? [];

  // Filtrar por búsqueda (título o descripción)
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filteredServices = filteredServices.filter(
      (service) =>
        service.Title.toLowerCase().includes(searchLower) ||
        service.Description.toLowerCase().includes(searchLower)
    );
  }

  // Filtrar por estado
  if (state === "1") {
    filteredServices = filteredServices.filter((service) => service.IsActive === true);
  } else if (state === "0") {
    filteredServices = filteredServices.filter((service) => service.IsActive === false);
  }

  // Paginación local
  const total = filteredServices.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const rows: Service[] = filteredServices.slice(startIndex, endIndex);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Servicios</h1>
      <p className="text-[#091540]/70 text-md">
        Gestione todos los servicios ofrecidos
      </p>
      <div className="border-b border-dashed border-gray-300 mb-8"></div>

      <ServiceHeaderBar
        limit={limit}
        total={total}
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
            total={total}
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
