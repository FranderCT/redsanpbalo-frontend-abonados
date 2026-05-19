"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/Components/ui/pagination";

export type DataPaginationProps = {
  /** Página actual (1-based) */
  page: number;
  /** Número total de páginas */
  pageCount: number;
  /** Total de ítems (opcional, para mostrar "X–Y de Z") */
  total?: number;
  /** Límite por página (para calcular rango mostrado) */
  pageSize?: number;
  /** Callback al cambiar de página */
  onPageChange: (page: number) => void;
  /** Textos en español */
  labels?: {
    previous?: string;
    next?: string;
    pageOf?: string;
    totalItems?: string;
  };
  /** Ocultar texto en botones prev/next en pantallas pequeñas (solo iconos) */
  compact?: boolean;
  className?: string;
};

const defaultLabels = {
  previous: "Anterior",
  next: "Siguiente",
  pageOf: "Página",
  totalItems: "elementos",
};

/** Genera el rango de números de página a mostrar, con elipsis si hay muchas */
function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [];
  const showLeft = current > 3;
  const showRight = current < total - 2;

  if (showLeft) pages.push(1, "ellipsis");
  else for (let i = 1; i <= Math.min(3, total); i++) pages.push(i);

  if (showLeft && showRight) {
    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 1 && i < total) pages.push(i);
    }
  } else if (showRight) {
    for (let i = Math.max(1, total - 2); i <= total; i++) pages.push(i);
  }

  if (showRight && current < total - 2) pages.push("ellipsis", total);
  return pages;
}

export function DataPagination({
  page,
  pageCount,
  total = 0,
  pageSize = 10,
  onPageChange,
  labels = {},
  compact = true,
  className,
}: DataPaginationProps) {
  const safePageCount = Math.max(1, pageCount);
  const L = { ...defaultLabels, ...labels };
  const pageNumbers = getPageRange(page, safePageCount);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <div
      className={cn(
        "min-w-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      role="navigation"
      aria-label="Paginación"
    >
      <p className="order-2 text-center text-sm text-muted-foreground sm:order-1 sm:text-left">
        {total > 0
          ? `${from}-${to} de ${total} ${L.totalItems}`
          : `0 ${L.totalItems}`}
      </p>

      <Pagination className="order-1 mx-0 min-w-0 w-full justify-center sm:order-2 sm:w-auto sm:justify-end ">
        <PaginationContent className="flex min-w-0 flex-nowrap items-center justify-center gap-1 sm:flex-wrap">
          <PaginationItem>
            <Button
              variant="outline"
              size={compact ? "icon" : "default"}
              className={cn(
                "h-8 w-8 shrink-0 gap-1 sm:h-9 sm:w-9",
                compact ? "sm:gap-1 sm:pl-2.5" : "pl-2.5"
              )}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              aria-label={L.previous}
            >
              <ChevronLeft className="h-4 w-4" />
              {!compact ? <span className="hidden sm:inline">{L.previous}</span> : null}
            </Button>
          </PaginationItem>

          <PaginationItem className="sm:hidden">
            <div className="flex h-8 shrink-0 items-center rounded-md border px-2 text-xs text-muted-foreground">
              {page}/{safePageCount}
            </div>
          </PaginationItem>

          {pageNumbers.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`} className="hidden sm:block">
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p} className="hidden sm:block">
                <Button
                  variant={page === p ? "outline" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => onPageChange(p)}
                  aria-current={page === p ? "page" : undefined}
                  aria-label={`${L.pageOf} ${p}`}
                >
                  {p}
                </Button>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <Button
              variant="outline"
              size={compact ? "icon" : "default"}
              className={cn(
                "h-8 w-8 shrink-0 gap-1 sm:h-9 sm:w-9",
                compact ? "sm:gap-1 sm:pr-2.5" : "pr-2.5"
              )}
              onClick={() => onPageChange(Math.min(safePageCount, page + 1))}
              disabled={page >= safePageCount}
              aria-label={L.next}
            >
              {!compact ? <span className="hidden sm:inline">{L.next}</span> : null}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
