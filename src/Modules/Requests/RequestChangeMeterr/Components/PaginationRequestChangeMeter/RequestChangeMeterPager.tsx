// src/Modules/Reques_Availability_Water/Components/PaginationReqAvailabilityWater/ReqAvailWaterPager.tsx
type Props = {
  page: number;                 // 1-based
  pageCount: number;            // >= 1
  onPageChange: (p: number) => void;
  variant?: "box" | "inline";
  className?: string;
};

export default function ReqChangeMeterPager({
  page,
  pageCount,
  onPageChange,
  variant = "inline",
  className = "",
}: Props) {
  const safePageCount = Math.max(1, pageCount);

  const first = () => onPageChange(1);
  const prev  = () => onPageChange(Math.max(1, page - 1));
  const next  = () => onPageChange(Math.min(safePageCount, page + 1));
  const last  = () => onPageChange(safePageCount);

  return (
    <div className={`flex items-center ${variant === "box" ? "px-3 py-2 border border-gray-200 shadow" : ""} ${className}`}>
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
  );
}
