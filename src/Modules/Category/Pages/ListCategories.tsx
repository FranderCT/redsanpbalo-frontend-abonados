// src/Modules/Category/Pages/ListCategories.tsx
import { useMemo, useState } from "react";
import { useSearchCategories } from "../Hooks/CategoryHooks";
import CategoryHeaderBar from "../Components/PaginationCategory/CategoryHeaderBar";
import CategoryTable from "../Components/TableCategory/CategoryTable";
import CreateCategoryModal from "../Components/ModalsCategory/CreateCategoryModal";
import type { Category } from "../Models/Category";

export default function ListCategories() {
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
  const { data, isLoading, error } = useSearchCategories(params);

  const rows: Category[] = data?.data ?? [];
  const meta = data?.meta ?? {
    total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false,
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-[#091540]">Lista de Categorías</h2>

      <CategoryHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onFilterClick={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateCategoryModal />}
      />

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Ocurrió un error al cargar las Categorías.</div>
        ) : (
          <CategoryTable
            data={rows}
            total={meta.total}
            page={meta.page}               // <- pasa paginación al footer
            pageCount={meta.pageCount}
            onPageChange={setPage}
          />
        )}
      </div>

    </div>
  );
}
