import { useEffect, useState } from "react";
import type { Project } from "../../Models/Project";

type Props = {
  data: Project[];
  page: number;  
  total?:number;      // 1-based
  pageCount: number;   // >= 1
  onPageChange: (p: number) => void;
  variant?: "box" | "inline"; // <- NUEVO
  className?: string;         // <- opcional por si quieres ajustar estilos
};

export default function ProjectPager({
  page, total,data,
  pageCount,
  onPageChange,
  variant = "box",
  className = "",
}: Props) {
  const safePageCount = Math.max(1, pageCount);
  const [, setGoto] = useState(page);

  useEffect(() => setGoto(page), [page]);

  const first = () => onPageChange(1);
  const prev  = () => onPageChange(Math.max(1, page - 1));
  const next  = () => onPageChange(Math.min(safePageCount, page + 1));
  const last  = () => onPageChange(safePageCount);

  return (
  <div className={`grid grid-cols-[auto_1fr_auto] items-center border border-gray-200 shadow-xl ${className}`}>
    {/* Izquierda: total */}
    <div className="text-sm px-2">
      Total registros: <b>{total ?? data.length}</b>
    </div>

    {/* Centro: paginación */}
    <div className={`justify-self-center ${variant === "box" ? "px-3 py-2" : ""}`}>
      <div className="flex justify-center items-center gap-3 text-sm">
        <button onClick={first} className="px-2 py-1 border hover:bg-gray-50 disabled:opacity-50" disabled={page <= 1}>
          «
        </button>
        <button onClick={prev} className="px-2 py-1 border hover:bg-gray-50 disabled:opacity-50" disabled={page <= 1}>
          ‹
        </button>

        <span className="px-2">
          Página <b>{page}</b> de <b>{safePageCount}</b>
        </span>

        <button onClick={next} className="px-2 py-1 border hover:bg-gray-50 disabled:opacity-50" disabled={page >= safePageCount}>
          ›
        </button>
        <button onClick={last} className="px-2 py-1 border hover:bg-gray-50 disabled:opacity-50" disabled={page >= safePageCount}>
          »
        </button>
      </div>
    </div>
  </div>
);

}
