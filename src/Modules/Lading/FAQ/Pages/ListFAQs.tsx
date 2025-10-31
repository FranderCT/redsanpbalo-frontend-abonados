import { useState } from "react";
import { useGetAllFAQs } from "../Hooks/FAQHooks";
import type { FAQ } from "../Models/FAQ";
import FAQHeaderBar from "../Components/PaginationFAQ/FAQHeaderBar";
import CreateFAQModal from "../Components/ModalsFAQ/CreateFAQModal";
import FAQTable from "../Components/TableFAQ/FAQTable";

export default function ListFAQs() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<string | undefined>(undefined);

  const { faqs, isPending: isLoading, error } = useGetAllFAQs();

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
    setState(newState || undefined);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setState(undefined);
    setPage(1);
  };

  // Filtrado local
  let filteredFAQs = faqs ?? [];

  // Filtrar por búsqueda (pregunta o respuesta)
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filteredFAQs = filteredFAQs.filter(
      (faq) =>
        faq.Question.toLowerCase().includes(searchLower) ||
        faq.Answer.toLowerCase().includes(searchLower)
    );
  }

  // Filtrar por estado
  if (state === "1") {
    filteredFAQs = filteredFAQs.filter((faq) => faq.IsActive === true);
  } else if (state === "0") {
    filteredFAQs = filteredFAQs.filter((faq) => faq.IsActive === false);
  }

  // Paginación local
  const total = filteredFAQs.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const rows: FAQ[] = filteredFAQs.slice(startIndex, endIndex);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Preguntas Frecuentes (FAQ)</h1>
      <p className="text-[#091540]/70 text-md">
        Gestione todas las preguntas frecuentes
      </p>
      <div className="border-b border-dashed border-gray-300 mb-8"></div>

      <FAQHeaderBar
        limit={limit}
        total={total}
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
            total={total}
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
