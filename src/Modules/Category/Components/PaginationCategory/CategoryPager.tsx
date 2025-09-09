import { useEffect, useState } from "react";

type Props = {
  page: number;        // 1-based
  pageCount: number;   // >= 1
  onPageChange: (p: number) => void;
};

export default function CategoryPager({ page, pageCount, onPageChange }: Props) {
  const safePageCount = Math.max(1, pageCount);
  const [goto, setGoto] = useState(page);

  useEffect(() => setGoto(page), [page]);

  const first = () => onPageChange(1);
  const prev  = () => onPageChange(Math.max(1, page - 1));
  const next  = () => onPageChange(Math.min(safePageCount, page + 1));
  const last  = () => onPageChange(safePageCount);

  const commitGoto = () => {
    const n = Math.min(safePageCount, Math.max(1, Number(goto) || 1));
    onPageChange(n);
  };

  return (
    <div className="w-full flex justify-center items-center gap-3 px-3 py-2 border border-[#D9DBE9] rounded bg-white text-sm">
      <button onClick={first} className="px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-50" disabled={page <= 1}>
        «
      </button>
      <button onClick={prev} className="px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-50" disabled={page <= 1}>
        ‹
      </button>

      <span className="px-2">Página <b>{page}</b> de <b>{safePageCount}</b></span>

      <button onClick={next} className="px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-50" disabled={page >= safePageCount}>
        ›
      </button>
      <button onClick={last} className="px-2 py-1 rounded border hover:bg-gray-50 disabled:opacity-50" disabled={page >= safePageCount}>
        »
      </button>

      <div className="flex items-center gap-2 ml-4">
        <span>Ir a página:</span>
        <input
          className="w-16 h-8 px-2 border rounded"
          type="number"
          min={1}
          max={safePageCount}
          value={goto}
          onChange={(e) => setGoto(Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && commitGoto()}
        />
      </div>
    </div>
  );
}
