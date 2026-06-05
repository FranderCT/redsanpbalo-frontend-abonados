import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/Components/ui/card";
import { DataPagination } from "@/Components/ui/data-pagination";
import ProjectHeaderBar from "../components/PaginationProject/ProjectHeaderBar";
import CreateProjectModal from "../components/CardsProject/CreateProject";
import type { ProjectPaginationParams } from "../Models/Project";
import { useSearchProjects } from "../Hooks/ProjectHooks";
import ProjectsGrid from "../components/CardsProject/ProjectsGrid";
import { useGetAllProjectStates } from "../../Project_State/Hooks/ProjectStateHooks";

const DEFAULT_LIMIT = 10;

function getPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSearchState(searchStr: string) {
  const searchParams = new URLSearchParams(searchStr);
  const rawProjectState = searchParams.get("projectState");
  const parsedProjectState = rawProjectState ? Number(rawProjectState) : undefined;

  return {
    page: getPositiveNumber(searchParams.get("page"), 1),
    limit: getPositiveNumber(searchParams.get("limit"), DEFAULT_LIMIT),
    search: searchParams.get("name") ?? "",
    projectStateId:
      typeof parsedProjectState === "number" && Number.isInteger(parsedProjectState) && parsedProjectState > 0
        ? parsedProjectState
        : undefined,
  };
}

export default function ListProjects() {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(() => parseSearchState(location.searchStr).page);
  const [limit, setLimit] = useState(() => parseSearchState(location.searchStr).limit);
  const [search, setSearch] = useState(() => parseSearchState(location.searchStr).search);
  const [projectStateId, setProjectStateId] = useState<number | undefined>(
    () => parseSearchState(location.searchStr).projectStateId,
  );
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (page > 1) searchParams.set("page", String(page));
    if (limit !== DEFAULT_LIMIT) searchParams.set("limit", String(limit));
    if (search.trim()) searchParams.set("name", search.trim());
    if (projectStateId) searchParams.set("projectState", String(projectStateId));

    const nextSearch = searchParams.toString();
    const nextUrl = `${location.pathname}${nextSearch ? `?${nextSearch}` : ""}${location.hash}`;
    const currentUrl = `${location.pathname}${location.searchStr}${location.hash}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [limit, location.hash, location.pathname, location.searchStr, page, projectStateId, search]);

  const handleSearchChange = (txt: string) => {
    startTransition(() => {
      setSearch(txt);
      setPage(1);
    });
  };

  const handleCleanFilters = () => {
    startTransition(() => {
      setSearch("");
      setProjectStateId(undefined);
      setPage(1);
    });
  };

  const params: ProjectPaginationParams = useMemo(
    () => ({
      page,
      limit,
      name: deferredSearch.trim() || undefined,
      projectState: projectStateId?.toString(),
    }),
    [deferredSearch, limit, page, projectStateId]
  );

  const { projectStates, projectStatesLoading } = useGetAllProjectStates();
  const { data, isLoading, error } = useSearchProjects(params);

  const items = data?.data ?? [];
  const meta = data?.meta ?? {
    hasNextPage: false,
    hasPrevPage: false,
    limit: limit,
    page: 1,
    pageCount: 1,
    total: 0,
  };

  return (
    <section className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Proyectos</h1>
      <p className="text-[#091540]/70 text-md">Visualice y gestione todos los proyectos registrados en el sistema.</p>
      <div className="border-b border-dashed border-gray-300 mb-4"></div>

      <ProjectHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        projectStateId={projectStateId}
        states={projectStates ?? []}
        statesLoading={projectStatesLoading}
        onLimitChange={(newLimit) => {
          startTransition(() => {
            setLimit(newLimit);
            setPage(1);
          });
        }}
        onSearchChange={handleSearchChange}
        onProjectStateChange={(id) => {
          startTransition(() => {
            setProjectStateId(id);
            setPage(1);
          });
        }}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateProjectModal />}
      />

      <div className="w-full">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Ocurrió un error al cargar los Proyectos.
          </div>
        ) : (
          <div>
            <ProjectsGrid
              projects={items}
              onDetails={(id) => navigate({ to: `/dashboard/projects/${id}` })}
              emptyText="No se encontraron proyectos con los filtros."
            />
          </div>
        )}
      </div>

      <Card className="border-none shadow-none">
        <CardContent className="pt-2 sm:pt-6">
          <DataPagination
            page={meta.page}
            pageCount={meta.pageCount}
            total={meta.total}
            pageSize={meta.limit}
            onPageChange={(nextPage) => {
              startTransition(() => {
                setPage(nextPage);
              });
            }}
            labels={{ totalItems: "proyectos" }}
            compact
          />
        </CardContent>
      </Card>
    </section>
  );
}
