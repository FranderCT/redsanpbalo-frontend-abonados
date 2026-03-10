import { useDeferredValue, useMemo, useState } from "react";
import { useSearchCategories } from "../Hooks/CategoryHooks";
import CategoryHeaderBar from "../Components/CategoryHeaderBar";
import CategoryCards from "../Components/CategoryCards";
import CreateCategoryModal from "../Components/CreateCategoryModal";
import type { Category, CategoryStateFilter } from "../Models/Category";

export default function ListCategories() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<CategoryStateFilter>("all");
  const deferredSearch = useDeferredValue(search);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    setPage(1);
  };

  const handleStateChange = (newState: CategoryStateFilter) => {
    setState(newState);
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

  const { data, isLoading, error } = useSearchCategories(params);

  const rows: Category[] = data?.data ?? [];
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
        <h1 className="text-2xl font-bold text-[#091540]">Lista de Categorías</h1>
        <p className="text-md text-[#091540]/70">
          Gestione todas las categorías desde una vista simple y enfocada en acciones.
        </p>
        
      </section>

      <CategoryHeaderBar
        limit={meta.itemsPerPage}
        total={meta.totalItems}
        search={search}
        state={state}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onFilterChange={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateCategoryModal />}
      />

      <div className="flex flex-col">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Cargando categorías...
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
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
