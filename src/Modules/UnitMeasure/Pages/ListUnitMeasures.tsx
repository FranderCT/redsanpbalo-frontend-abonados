import { useDeferredValue, useMemo, useState } from "react";
import { useSearchUnits } from "../Hooks/UnitMeasureHooks";
import type { Unit, UnitStateFilter } from "../Models/unit";
import UnitHeaderBar from "../Components/UnitHeaderBar";
import CreateUnitMeasureModal from "../Components/CreateUnitMeasureModal";
import UnitCards from "../Components/UnitCards";

export default function ListUnitMeasures() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<UnitStateFilter>("all");
  const deferredSearch = useDeferredValue(search);

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    setPage(1);
  };

  const handleStateChange = (newState: UnitStateFilter) => {
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

  const { data, isLoading, error } = useSearchUnits(params);

  const rows: Unit[] = data?.data ?? [];
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
        <h1 className="text-2xl font-bold text-[#091540]">Lista de Unidades de Medida</h1>
        <p className="text-md text-[#091540]/70">
          Gestione todas las unidades de medida desde una vista simple y enfocada en acciones.
        </p>
        <div className="border-b border-dashed border-slate-300" />
      </section>

      <UnitHeaderBar
        limit={meta.itemsPerPage}
        total={meta.totalItems}
        search={search}
        state={state}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onFilterChange={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateUnitMeasureModal />}
      />

      <div className="flex flex-col">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Cargando unidades de medida...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Ocurrió un error al cargar las unidades de medida.
          </div>
        ) : (
          <UnitCards
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
