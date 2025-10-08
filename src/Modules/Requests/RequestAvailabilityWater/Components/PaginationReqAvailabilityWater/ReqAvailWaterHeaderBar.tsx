import { BrushCleaning } from "lucide-react";
import type { ReactNode } from "react";
import type { RequestState } from "../../../StateRequest/Model/RequestState";
import PaginationSearch from "../../../../../Components/PaginationSearch";

type Props = {
  limit: number;
  total: number;
  search: string;
  state?: string;
  requestStateId?: number;
  states: RequestState[];
  statesLoading?: boolean;
  onStateRequestChange: (id?: number) => void;
  onLimitChange: (n: number) => void;
  onFilterClick: (text: string) => void; // Activo/Inactivo si lo usas
  onSearchChange: (text: string) => void;
  onCleanFilters: () => void;
  rightAction?: ReactNode;
};

export default function ReqAvailWaterHeaderBar({
  limit,
  search,
  state,
  requestStateId,
  states,
  statesLoading,
  onStateRequestChange,
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
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Activo/Inactivo (si aplica) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Estado:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={state}
          onChange={(e) => onFilterClick(e.target.value || "")}
        >
          <option value="">Todos</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      {/* Estado de la solicitud */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Estado de la solicitud:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={requestStateId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onStateRequestChange(v ? Number(v) : undefined);
          }}
          disabled={!!statesLoading}
        >
          <option value="">{statesLoading ? "Cargando..." : "Todos"}</option>
          {states.map((s) => (
            <option key={s.Id} value={s.Id}>
              {s.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Buscador + limpiar */}
      <div className="inline-flex items-center gap-2">
      <PaginationSearch
        search={search}
        onSearchChange={onSearchChange}
        fluid={false}
        widthClass="w-[300px]"
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

      <div className="ml-auto">{rightAction}</div>
    </div>
  );
}
