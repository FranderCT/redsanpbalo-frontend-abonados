import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import ProductHeaderBar from "../Components/ProductHeaderBar";
import CreateProductModal from "../Components/Modals/CreateProductModal";
import ProductTable from "../Components/ProductsTable/ProductTable";
import { useSearchProducts } from "../Hooks/ProductsHooks";
import type { Product, ProductStateFilter } from "../Models/CreateProduct";

const DEFAULT_LIMIT = 10;

function getStateFilter(value: string | null): ProductStateFilter {
  return value === "active" || value === "inactive" ? value : "all";
}

function getPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSearchState(searchStr: string) {
  const searchParams = new URLSearchParams(searchStr);

  return {
    page: getPositiveNumber(searchParams.get("page"), 1),
    limit: getPositiveNumber(searchParams.get("limit"), DEFAULT_LIMIT),
    search: searchParams.get("q") ?? "",
    state: getStateFilter(searchParams.get("state")),
  };
}

export default function ListProducts() {
  const location = useLocation();
  const [page, setPage] = useState(() => parseSearchState(location.searchStr).page);
  const [limit, setLimit] = useState(() => parseSearchState(location.searchStr).limit);
  const [search, setSearch] = useState(() => parseSearchState(location.searchStr).search);
  const [state, setState] = useState<ProductStateFilter>(() => parseSearchState(location.searchStr).state);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (page > 1) searchParams.set("page", String(page));
    if (limit !== DEFAULT_LIMIT) searchParams.set("limit", String(limit));
    if (search.trim()) searchParams.set("q", search.trim());
    if (state !== "all") searchParams.set("state", state);

    const nextSearch = searchParams.toString();
    const nextUrl = `${location.pathname}${nextSearch ? `?${nextSearch}` : ""}${location.hash}`;
    const currentUrl = `${location.pathname}${location.searchStr}${location.hash}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [limit, location.hash, location.pathname, location.searchStr, page, search, state]);

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearch(value);
      setPage(1);
    });
  };

  const handleStateChange = (value: ProductStateFilter) => {
    startTransition(() => {
      setState(value);
      setPage(1);
    });
  };

  const handleCleanFilters = () => {
    startTransition(() => {
      setSearch("");
      setState("all");
      setPage(1);
    });
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
    hasNextPage: false,
    hasPrevPage: false,
    limit: limit,
    page: 1,
    pageCount: 1,
    total: 0,
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
        limit={meta.limit}
        total={meta.total}
        search={search}
        state={state}
        onLimitChange={(value) => {
          startTransition(() => {
            setLimit(value);
            setPage(1);
          });
        }}
        onFilterChange={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateProductModal />}
      />

      <div className="flex flex-col">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Cargando productos…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Ocurrió un error al cargar los productos.
          </div>
        ) : (
          <ProductTable
            data={rows}
            total={meta.total}
            page={meta.page}
            pageCount={meta.pageCount}
            pageSize={meta.limit}
            onPageChange={(nextPage) => {
              startTransition(() => {
                setPage(nextPage);
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
