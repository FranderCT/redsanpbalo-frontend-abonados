
import ProjectHeaderBar from "../components/PaginationProject/ProjectHeaderBar";
import ProjectPager from "../components/PaginationProject/ProjectPager";

import { useNavigate } from "@tanstack/react-router";
import CreateProjectModal from "../components/CardsProject/CreateProject";
import { useMemo, useState } from "react";
import type { ProjectPaginationParams } from "../Models/Project";
import { useSearchProjects } from "../Hooks/ProjectHooks";
import ProjectsGrid from "../components/CardsProject/ProjectsGrid";


export default function ListProjects() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);   // 1-based
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [name, setName] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined); // ""|"1"|"0" según tu API

  const handleSearchChange = (txt: string) => {
    setSearch(txt);
    const trimmed = txt.trim();
    setName(trimmed ? trimmed : undefined);
    setPage(1);
  };

  const handleStateChange = (newState: string) => {
    setState(newState || undefined);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setName(undefined);
    setState(undefined);
    setPage(1);
  };

  const params: ProjectPaginationParams = useMemo(
    () => ({ page, limit, name, state }),
    [page, limit, name, state]
  );

  const { data, isLoading, error } = useSearchProjects(params);

  const items = data?.data ?? [];
  const meta = data?.meta ?? {
    total: 0,
    page: 1,
    limit,
    pageCount: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <section className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-[#091540]">Lista de Proyectos</h1>
      <p className="text-[#091540]/70 text-md">Gestione todos los proyectos</p>
      <div className="border-b border-dashed border-gray-300 mb-4"></div>

      <ProjectHeaderBar
        limit={meta.limit}
        total={meta.total}
        search={search}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        onFilterClick={handleStateChange}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
        rightAction={<CreateProjectModal />} // 👈 formulario rápido
      />

      <div className="w-full">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Cargando…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Ocurrió un error al cargar los Proyectos.
          </div>
        ) : (
          <div className="">
            <ProjectsGrid
              projects={items}
              onDetails={(id) => navigate({ to: `/dashboard/projects/${id}` })}
              emptyText="No se encontraron proyectos con los filtros."
            />
          </div>
        )}
      </div>

      <ProjectPager
              page={meta.page}
              total={meta.total}
              pageCount={meta.pageCount}
              onPageChange={setPage}
              variant="box"
              className="mt-2" data={[]}      />
    </section>
  );
}
