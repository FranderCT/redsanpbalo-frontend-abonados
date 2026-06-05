import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Card, CardContent } from "@/Components/ui/card";
import { DataPagination } from "@/Components/ui/data-pagination";
import { useSearchMaterials } from "../Hooks/MaterialHooks";
import type { Material, MaterialStateFilter } from "../Models/Material";
import MaterialHeaderBar from "../Components/MaterialHeaderBar";
import CreateMaterialModal from "../Components/CreateMaterialModal";
import MaterialCard from "../Components/MaterialCard";

const DEFAULT_LIMIT = 10;

function getStateFilter(value: string | null): MaterialStateFilter {
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

export default function ListMaterials() {
  const location = useLocation();
  const [page, setPage] = useState(() => parseSearchState(location.searchStr).page);
  const [limit, setLimit] = useState(() => parseSearchState(location.searchStr).limit);
  const [search, setSearch] = useState(() => parseSearchState(location.searchStr).search);
  const [state, setState] = useState<MaterialStateFilter>(() => parseSearchState(location.searchStr).state);
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

  const handleSearchChange = (txt: string) => {
    startTransition(() => {
      setSearch(txt);
      setPage(1);
    });
  };

  const handleStateChange = (newState: MaterialStateFilter) => {
    startTransition(() => {
      setState(newState);
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

  const { data, isLoading, error } = useSearchMaterials(params);

  const rows: Material[] = data?.data ?? [];
  const meta = data?.meta ?? {
    hasNextPage: false,
    hasPrevPage: false,
    limit: 0,
    page: 0,
    pageCount:0,
    total:0,
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#091540]">Lista de Materiales</h1>
        <p className="text-md text-[#091540]/70">
          Gestione todos los materiales desde una vista simple y enfocada en acciones.
        </p>
        <div className="border-b border-dashed border-slate-300" />
      </section>

      <MaterialHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        state={state}
        onLimitChange={(newLimit) => {
          startTransition(() => {
            setLimit(newLimit);
            setPage(1);
          });
        }}
        onFilterChange={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateMaterialModal />}
      />

      <div className="flex flex-col">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Cargando materiales…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Ocurrió un error al cargar los materiales.
          </div>
        ) : (
          <section className="flex w-full flex-col gap-4">
            {rows.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="text-base font-semibold text-slate-900">No hay materiales para mostrar</p>
                <p className="mt-2 max-w-md text-sm text-slate-500">
                  Ajusta los filtros o registra un nuevo material para empezar a gestionar este modulo.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 [content-visibility:auto]">
                {rows.map((material) => (
                  <MaterialCard key={material.Id} material={material} />
                ))}
              </div>
            )}

            <Card className="border-none shadow-none">
              <CardContent className="pt-6">
                <DataPagination
                  page={meta.page}
                  pageCount={meta.pageCount}
                  total={meta.total}
                  onPageChange={(nextPage) => {
                    startTransition(() => {
                      setPage(nextPage);
                    });
                  }}
                  labels={{ totalItems: "materiales" }}
                  compact
                />
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
