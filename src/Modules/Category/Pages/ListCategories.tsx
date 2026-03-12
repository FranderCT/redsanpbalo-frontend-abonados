import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { useSearchCategories } from "../Hooks/CategoryHooks";
import CategoryHeaderBar from "../Components/CategoryHeaderBar";
import CategoryCards from "../Components/CategoryCards";
import CreateCategoryModal from "../Components/CreateCategoryModal";
import type { Category, CategoryStateFilter } from "../Models/Category";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const EMPTY_META: PaginatedResponse<Category>["meta"] = {
  totalItems: 0,
  itemCount: 0,
  itemsPerPage: DEFAULT_LIMIT,
  totalPages: 1,
  currentPage: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

type CategoryFiltersState = {
  page: number;
  limit: number;
  search: string;
  state: CategoryStateFilter;
};

function getStateFilter(value: string | null): CategoryStateFilter {
  return value === "active" || value === "inactive" ? value : "all";
}

function getPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSearchState(searchStr: string): CategoryFiltersState {
  const searchParams = new URLSearchParams(searchStr);

  return {
    page: getPositiveNumber(searchParams.get("page"), DEFAULT_PAGE),
    limit: getPositiveNumber(searchParams.get("limit"), DEFAULT_LIMIT),
    search: searchParams.get("q") ?? "",
    state: getStateFilter(searchParams.get("state")),
  };
}

export default function ListCategories() {
  const location = useLocation();
  const [filters, setFilters] = useState<CategoryFiltersState>(() => parseSearchState(location.searchStr));
  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (filters.page > DEFAULT_PAGE) searchParams.set("page", String(filters.page));
    if (filters.limit !== DEFAULT_LIMIT) searchParams.set("limit", String(filters.limit));
    if (filters.search.trim()) searchParams.set("q", filters.search.trim());
    if (filters.state !== "all") searchParams.set("state", filters.state);

    const nextSearch = searchParams.toString();
    const nextUrl = `${location.pathname}${nextSearch ? `?${nextSearch}` : ""}${location.hash}`;
    const currentUrl = `${location.pathname}${location.searchStr}${location.hash}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [filters, location.hash, location.pathname, location.searchStr]);

  const handleSearchChange = (txt: string) => {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        search: txt,
        page: DEFAULT_PAGE,
      }));
    });
  };

  const handleStateChange = (newState: CategoryStateFilter) => {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        state: newState,
        page: DEFAULT_PAGE,
      }));
    });
  };

  const handleCleanFilters = () => {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        search: "",
        state: "all",
        page: DEFAULT_PAGE,
      }));
    });
  };

  const params = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      q: deferredSearch.trim() || undefined,
      state:
        filters.state === "all" ? undefined :
        filters.state === "active" ? true :
        false,
    }),
    [deferredSearch, filters.limit, filters.page, filters.state],
  );

  const { data, isLoading, error } = useSearchCategories(params);

  const rows: Category[] = data?.data ?? [];
  const meta = data?.meta ?? { ...EMPTY_META, itemsPerPage: filters.limit };

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#091540]">Lista de Categorías</h1>
        <p className="text-md text-[#091540]/70">
          Gestione todas las categorías desde una vista simple y enfocada en acciones.
        </p>
        
      </section>

      <CategoryHeaderBar
        limit={meta.itemsPerPage}
        total={meta.totalItems}
        search={filters.search}
        state={filters.state}
        onLimitChange={(newLimit) => {
          startTransition(() => {
            setFilters((current) => ({
              ...current,
              limit: newLimit,
              page: DEFAULT_PAGE,
            }));
          });
        }}
        onFilterChange={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateCategoryModal />}
      />

      <div className="flex flex-col">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Cargando categorías…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Ocurrió un error al cargar las categorías.
          </div>
        ) : (
          <CategoryCards
            data={rows}
            total={meta.totalItems}
            page={meta.currentPage}
            pageCount={meta.totalPages}
            onPageChange={(page) => {
              setFilters((current) => ({
                ...current,
                page,
              }));
            }}
          />
        )}
      </div>
    </div>
  );
}
