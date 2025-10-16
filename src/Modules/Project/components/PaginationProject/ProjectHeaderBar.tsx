
import { BrushCleaning } from 'lucide-react';
import type { ReactNode } from "react";
import PaginationSearch from '../../../../Components/PaginationSearch';
import type { ProjectState } from '../../../Project_State/Models/ProjectState';


type Props = {
  limit: number;
  total: number;
  search: string;
  state?: string;
  projectStateId?: number;
  states: ProjectState[];
  statesLoading?: boolean;
  onProjectStateChange: (id?: number) => void;
  onLimitChange: (n: number) => void;
  onFilterClick: (text: string) => void;
  onSearchChange: (text: string) => void;
  onCleanFilters: () => void, // <- aplica al escribir (el container decide)
  rightAction?: ReactNode;
};

export default function ProjectHeaderBar({
  limit,
  search,
  state,
  projectStateId,
  states,
  statesLoading,
  onProjectStateChange,
  onLimitChange,
  onFilterClick,
  onSearchChange,
  onCleanFilters,
  rightAction,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filas por página */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Filas por página:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {[5,10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Filtrar */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Estado:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={state}
          onChange={(e) => onFilterClick(e.target.value || "")}
        >
          <option value="">Todos</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
      {/* Estado del proyecto */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Estado del proyecto:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={projectStateId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onProjectStateChange(v ? Number(v) : undefined);
          }}
          disabled={!!statesLoading}
        >
          <option value="">{statesLoading ? "Cargando..." : "Todos"}</option>
          {states.map(s => (
            <option key={s.Id} value={s.Id}>{s.Name}</option>
          ))}
        </select>
      </div>

      
      <div className="inline-flex items-center gap-2">
        <PaginationSearch
          search={search}
          onSearchChange={onSearchChange}
          fluid={false}            // <- NO se expande
          widthClass="w-[300px]"   // <- ancho exacto del buscador
        />
        <button
            onClick={onCleanFilters}
            className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm hover:bg-gray-50 shrink-0"
            type="button"
            title="Limpiar filtros"
          >
            <BrushCleaning className="size-[23px]" />
          </button>
      </div>

      {/* Botón agregar alineado a la derecha */}
      <div className="ml-auto">
        {rightAction}
      </div>
    </div>
  );
}
