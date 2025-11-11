import { useState, useMemo } from "react";
import ProductHeaderBar from "../../Products/Components/PaginationProducts/ProductHeaderBar";
import { useSearchLegalSupplier } from "../Hooks/LegalSupplierHooks";
import type { LegalSupplier } from "../Models/LegalSupplier";
import LegalSupplierTable from "../Components/Table/LegalSupplierTable";
import CreateLegalSupplierModal from "../Components/Modals/CreateLegalSupplierModal";
import ListPhysicalSuppliers from "../../PhysicalSupplier/Pages/ListPhysicalSuppliers";
import CreateProveedorFisico from "@/Modules/ProveedoresFisicos/Components/CreateProveedorFisico";



export default function ListLegalSuppliers() {
  const [page, setPage] = useState(1);   // 1-based
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

   // Manejo de filtro por estado
  const handleStateChange = (newState: string) => {
    setState(newState || undefined);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setName(undefined);
    setState(undefined);
    setPage(1);
  }
  
  const params = useMemo(() => ({ page, limit, name, state }), [page, limit, name, state]);
  const { data, isLoading, error } = useSearchLegalSupplier(params);

  const rows: LegalSupplier[] = data?.data ?? [];
  const meta = data?.meta ?? {
    total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false,
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista proveedores jurídicos</h1>
        <p className="text-[#091540]/70 text-md">
            Gestione todos los proveedores jurídicos
        </p>
        <div className="border-b border-dashed border-gray-300 mb-8"></div>

      <ProductHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onFilterClick={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateLegalSupplierModal />}
      />

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Ocurrió un error al cargar los Productos.</div>
        ) : (
          <LegalSupplierTable
            data={rows}
            total={meta.total}
            page={meta.page}               // <- pasa paginación al footer
            pageCount={meta.pageCount}
            onPageChange={setPage}
          />
        )}
      </div>

      <ListPhysicalSuppliers />
      <CreateProveedorFisico />

    </div>
  );
}
