import { useState, useMemo } from "react";
import PhysicalSupplierHeaderBar from "../Components/Pagination/PhysicalSupplierHeaderBar";
import PhysicalSupplierCards from "../Components/ListPhysicalSuppliers/PhysicalSupplierCards";
import type { PhysicalSupplier } from "../Models/PhysicalSupplier";
import { useSearchPhysicalSupplier } from "../Hooks/PhysicalSupplierHooks";
import CreatePhysicalSupplierModal from "../Components/Modals/CreatePhysicalSupplierModal";

export default function ListPhysicalSuppliers() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [name, setName] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    setName(txt.trim() ? txt.trim() : undefined);
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
  const { data, isLoading, error } = useSearchPhysicalSupplier(params);

  const rows: PhysicalSupplier[] = data?.data ?? [];
  const rawMeta = data?.meta;
  const meta = {
    limit: rawMeta?.itemsPerPage ?? limit,
    total: rawMeta?.totalItems ?? 0,
    page: rawMeta?.currentPage ?? 1,
    pageCount: rawMeta?.totalPages ?? 1,
    hasNextPage: rawMeta?.hasNextPage ?? false,
    hasPrevPage: rawMeta?.hasPrevPage ?? false,
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Proveedores físicos</h1>
      <p className="text-muted-foreground text-base">
        Gestione todos los proveedores físicos.
      </p>
      <div className="border-b border-border mb-6" />

      <PhysicalSupplierHeaderBar
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
        rightAction={<CreatePhysicalSupplierModal />}
      />

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-destructive">
            Ocurrió un error al cargar los proveedores físicos.
          </div>
        ) : (
          <PhysicalSupplierCards
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
