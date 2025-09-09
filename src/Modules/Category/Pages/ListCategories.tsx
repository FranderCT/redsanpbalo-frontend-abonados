// src/Modules/Category/Pages/ListCategories.tsx
import { useMemo, useState } from "react";
import { useSearchCategories } from "../Hooks/CategoryHooks";
import CategoryHeaderBar from "../Components/PaginationCategory/CategoryHeaderBar";
import CategoryFilterModal from "../Components/PaginationCategory/CategoryFilterModal";
import CategoryTable from "../Components/TableCategory/CategoryTable";
import CreateCategoryModal from "../Components/ModalsCategory/CreateCategoryModal";
import type { Category } from "../Models/Category";
import CategoryPager from "../Components/PaginationCategory/CategoryPager";

export default function ListCategories() {
  const [page, setPage] = useState(1);   // 1-based
  const [limit, setLimit] = useState(10);

  // texto visible en el input
  const [search, setSearch] = useState("");
  // valor que se envía al backend
  const [name, setName] = useState<string | undefined>(undefined);

  // ⬇️ APLICA en vivo: al escribir, actualiza 'name' y resetea a página 1
  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setName(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const params = useMemo(() => ({ page, limit, name }), [page, limit, name]);
  const { data, isLoading, error } = useSearchCategories(params);

  const rows: Category[] = data?.data ?? [];
  const meta = data?.meta ?? {
    total: 0, page: 1, limit, pageCount: 1, hasNextPage: false, hasPrevPage: false,
  };

  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-[#091540]">Lista de Categorías</h2>

      <CategoryHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onFilterClick={() => setOpenFilter(true)}
        onSearchChange={handleSearchChange}   // <- aplica al escribir
        rightAction={<CreateCategoryModal />}
      />

      {/* Tabla */}
      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Ocurrió un error al cargar las Categorías.
          </div>
        ) : (
          <CategoryTable data={rows} total={meta.total} />
        )}
      </div>

      {/* Paginación inferior */}
      <CategoryPager
        page={meta.page}
        pageCount={meta.pageCount}
        onPageChange={(p) => setPage(p)}
      />

      {/* Filtros → también aplica al instante */}
      <CategoryFilterModal
        open={openFilter}
        initialName={search}
        onClose={() => setOpenFilter(false)}
        onApply={(next) => handleSearchChange(next)}
      />
    </div>
  );
}
