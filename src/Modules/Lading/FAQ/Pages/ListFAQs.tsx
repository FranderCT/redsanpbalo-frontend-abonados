import { useMemo, useState } from "react";
import { useSearchFAQs } from "../Hooks/FAQHooks";
import type { FAQ } from "../Models/FAQ";
import FAQHeaderBar from "../Components/PaginationFAQ/FAQHeaderBar";
import CreateFAQModal from "../Components/ModalsFAQ/CreateFAQModal";
import FAQTable from "../Components/TableFAQ/FAQTable";

export default function ListFAQs() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [question, setQuestion] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setQuestion(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
    setState(newState || undefined);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setQuestion(undefined);
    setState(undefined);
    setPage(1);
  };

  // Construir parámetros para la búsqueda
  const params = useMemo(() => ({ page, limit, question, state }), [page, limit, question, state]);
  const { data, isLoading, error } = useSearchFAQs(params);

  const rows: FAQ[] = data?.data ?? [];
  const meta = data?.meta ?? {
    total: 0,
    page: 1,
    limit,
    pageCount: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Preguntas Frecuentes (FAQ)</h1>
      <p className="text-[#091540]/70 text-md">
        Gestione todas las preguntas frecuentes
      </p>
      <div className="border-b border-dashed border-gray-300 mb-8"></div>

      <FAQHeaderBar
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
        rightAction={<CreateFAQModal />}
      />

      <div className="overflow-x-auto shadow-xl border border-gray-200 rounded">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Ocurrió un error al cargar las FAQs.
          </div>
        ) : (
          <FAQTable
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
