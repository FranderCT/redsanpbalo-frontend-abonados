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

  return (
    <div
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center", className)}
      role="navigation"
      aria-label="Paginación"
    >

      <Pagination className="order-1 sm:order-2">
        <PaginationContent className="flex flex-wrap justify-center gap-1">
          <PaginationItem>
            <Button
              variant="outline"
              size={compact ? "icon" : "default"}
              className={cn(
                "h-9 gap-1",
                compact ? "sm:gap-1 sm:pl-2.5" : "pl-2.5"
              )}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              aria-label={L.previous}
            >
              <ChevronLeft className="h-4 w-4" />
              {!compact && <span className="hidden sm:inline">{L.previous}</span>}
            </Button>
          </PaginationItem>

          {pageNumbers.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
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
                "h-9 gap-1",
                compact ? "sm:gap-1 sm:pr-2.5" : "pr-2.5"
              )}
              onClick={() => onPageChange(Math.min(safePageCount, page + 1))}
              disabled={page >= safePageCount}
              aria-label={L.next}
            >
              {!compact && <span className="hidden sm:inline">{L.next}</span>}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
