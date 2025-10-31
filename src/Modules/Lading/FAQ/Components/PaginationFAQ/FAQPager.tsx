import { useEffect, useState } from "react";

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  variant?: "box" | "inline";
  className?: string;
};

export default function FAQPager({
  page,
  pageCount,
  onPageChange,
  variant = "box",
  className = "",
}: Props) {
  const safePageCount = Math.max(1, pageCount);
  const [, setGoto] = useState(page);

  useEffect(() => setGoto(page), [page]);

  const first = () => onPageChange(1);
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(safePageCount, page + 1));
  const last = () => onPageChange(safePageCount);

  const base = "flex justify-center items-center gap-3 text-sm";
  const box = "px-3 py-2 border border-[#D9DBE9] rounded bg-white";
  const inline = "";

  return (
    <div className={`${base} ${variant === "box" ? box : inline} ${className}`}>
      <button 
        onClick={first} 
        className="px-2 py-1 border hover:bg-gray-50 disabled:opacity-50" 
        disabled={page <= 1}
      >
        «
      </button>
      <button 
        onClick={prev} 
        className="px-2 py-1 border hover:bg-gray-50 disabled:opacity-50" 
        disabled={page <= 1}
      >
        ‹
      </button>

      <span className="px-2">
        Página <b>{page}</b> de <b>{safePageCount}</b>
      </span>

      <button 
        onClick={next} 
        className="px-2 py-1 border hover:bg-gray-50 disabled:opacity-50" 
        disabled={page >= safePageCount}
      >
        ›
      </button>
      <button 
        onClick={last} 
        className="px-2 py-1 border hover:bg-gray-50 disabled:opacity-50" 
        disabled={page >= safePageCount}
      >
        »
      </button>
    </div>
  );
}
