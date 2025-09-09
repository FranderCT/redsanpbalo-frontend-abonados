// src/Modules/Category/Components/CategoryHeaderBar.tsx

import type { ReactNode } from "react";
import PaginationSearch from "./PaginationSearch";


type Props = {
  limit: number;
  total: number;
  search: string;
  onLimitChange: (n: number) => void;
  onFilterClick: () => void;
  onSearchChange: (text: string) => void; // <- aplica al escribir (el container decide)
  rightAction?: ReactNode;
};

export default function CategoryHeaderBar({
  limit,
  search,
  onLimitChange,
  onFilterClick,
  onSearchChange,
  rightAction,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filas por página */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Filas por página:</span>
        <select
          className="h-9 px-3 rounded border border-[#D9DBE9] bg-white text-sm outline-none"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {[5,10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Filtrar */}
      <button
        onClick={onFilterClick}
        className="h-9 px-3 rounded border border-[#D9DBE9] bg-white text-sm hover:bg-gray-50"
        type="button"
      >
        Filtrar
      </button>

      {/* Buscar por nombre (en vivo) */}
      <PaginationSearch search={search} onSearchChange={onSearchChange} />

      {/* Total y acción derecha */}
      {/* <span className="ml-auto text-sm text-gray-600">
        Total registros: <b>{total}</b>
      </span> */}
      {rightAction}
    </div>
  );
}
