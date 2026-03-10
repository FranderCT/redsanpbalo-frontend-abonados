import { useDeferredValue, useMemo, useState } from "react";
import ProductHeaderBar from "../Components/ProductHeaderBar";
import CreateProductModal from "../Components/Modals/CreateProductModal";
import ProductTable from "../Components/ProductsTable/ProductTable";
import { useSearchProducts } from "../Hooks/ProductsHooks";
import type { Product, ProductStateFilter } from "../Models/CreateProduct";

export default function ListProducts() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<ProductStateFilter>("all");
  const deferredSearch = useDeferredValue(search);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStateChange = (value: ProductStateFilter) => {
    setState(value);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setState("all");
    setPage(1);
  };

  const params = useMemo(
    () => ({
      page,
      limit,
      q: deferredSearch.trim() || undefined,
      state:
        state === "all" ? undefined :
        state === "active" ? true :
        false,
    }),
    [deferredSearch, limit, page, state],
  );

  const { data, isLoading, error } = useSearchProducts(params);

  const rows: Product[] = data?.data ?? [];
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
        <h1 className="text-2xl font-bold text-[#091540]">Lista de Productos</h1>
        <p className="text-md text-[#091540]/70">
          Gestione productos desde una tabla única con filtros simples y acciones rápidas.
        </p>
        <div className="border-b border-dashed border-slate-300" />
      </section>

      <ProductHeaderBar
        limit={meta.itemsPerPage}
        total={meta.totalItems}
        search={search}
        state={state}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        onFilterChange={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateProductModal />}
      />

      <div className="flex flex-col">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Cargando productos...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Ocurrió un error al cargar los productos.
          </div>
        ) : (
          <ProductTable
            data={rows}
            total={meta.totalItems}
            page={meta.currentPage}
            pageCount={meta.totalPages}
            pageSize={meta.itemsPerPage}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
