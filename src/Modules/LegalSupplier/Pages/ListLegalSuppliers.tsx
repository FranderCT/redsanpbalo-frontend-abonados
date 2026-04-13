import { useState, useMemo } from "react";
import LegalSupplierHeaderBar from "../Components/Pagination/LegalSupplierHeaderBar";
import { useSearchLegalSupplier } from "../Hooks/LegalSupplierHooks";
import type { LegalSupplier } from "../Models/LegalSupplier";
import LegalSupplierCards from "../Components/ListLegalSuppliers/LegalSupplierCards";
import CreateLegalSupplierModal from "../Components/Modals/CreateLegalSupplierModal";

export default function ListLegalSuppliers() {
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

  const params = useMemo(
    () => ({ page, limit, name, state }),
    [page, limit, name, state]
  );
  const { data, isLoading, error } = useSearchLegalSupplier(params);

  const rows: LegalSupplier[] = data?.data ?? [];
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
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Lista proveedores jurídicos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestione todos los proveedores jurídicos
        </p>
        <div className="mt-4 border-b border-dashed border-border" />
      </div>

      <LegalSupplierHeaderBar
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
        rightAction={<CreateLegalSupplierModal />}
      />

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Cargando…</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-destructive">
              Ocurrió un error al cargar los proveedores jurídicos.
            </p>
          </div>
        ) : (
          <div className="p-4">
            <LegalSupplierCards
              data={rows}
              total={meta.total}
              page={meta.page}
              pageCount={meta.pageCount}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
