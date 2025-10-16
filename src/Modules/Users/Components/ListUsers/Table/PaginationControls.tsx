type Props = {
  canPrev: boolean;
  canNext: boolean;
  pageIndex: number;      // 0-based
  pageCount: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onGotoPage: (pageZeroBased: number) => void;
};

const PaginationControls = ({
  canPrev,
  canNext,
  pageIndex,
  pageCount,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onGotoPage,
}: Props) => {
  return (
    <div className="flex flex-wrap items-center justify-center ">
      <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={onFirst} disabled={!canPrev} title="Primera página">
        «
      </button>
      <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={onPrev} disabled={!canPrev} title="Anterior">
        ‹
      </button>

      <span className="mx-2 text-sm">
        Página <b>{pageIndex + 1}</b> de <b>{pageCount}</b>
      </span>

      <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={onNext} disabled={!canNext} title="Siguiente">
        ›
      </button>
      <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={onLast} disabled={!canNext} title="Última página">
        »
      </button>

      <label className="ml-4 text-sm text-gray-600">
        Ir a página:
        <input
          type="number"
          min={1}
          max={pageCount || 1}
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const v = Number(e.target.value);
            onGotoPage(!Number.isNaN(v) && v > 0 ? v - 1 : 0);
          }}
          className="ml-2 w-20 rounded border px-2 py-1"
        />
      </label>
    </div>
  );
};

export default PaginationControls;
