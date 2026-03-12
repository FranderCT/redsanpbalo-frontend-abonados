import type { ReactNode } from "react";
import { BrushCleaning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;

type Props = {
  limit: number;
  total: number;
  read?: string;
  onLimitChange: (n: number) => void;
  onFilterClick: (text: string) => void;
  onCleanFilters: () => void;
  rightAction?: ReactNode;
};

export default function CommentHeaderBar({
  limit,
  total,
  read,
  onLimitChange,
  onFilterClick,
  onCleanFilters,
  rightAction,
}: Props) {
  const safeLimit = PAGE_SIZE_OPTIONS.includes(limit as (typeof PAGE_SIZE_OPTIONS)[number])
    ? limit
    : 10;

  return (
    <Card className="border shadow-none">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base text-[#091540]">Filtros de comentarios</CardTitle>
          <p className="text-sm text-slate-500">
            {total} {total === 1 ? "registro encontrado" : "registros encontrados"}
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          {rightAction}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-[140px] flex-col gap-2">
            <Label htmlFor="comment-limit-select">Filas por página</Label>
            <Select value={String(safeLimit)} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger
                id="comment-limit-select"
                aria-label="Filas por página"
                className="bg-white text-foreground"
              >
                <SelectValue placeholder="Selecciona un límite" />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-[160px] flex-col gap-2">
            <Label htmlFor="comment-state-filter">Estado</Label>
            <Select
              value={read ?? "all"}
              onValueChange={(value) => onFilterClick(value === "all" ? "" : value)}
            >
              <SelectTrigger
                id="comment-state-filter"
                aria-label="Filtrar por estado"
                className="bg-white text-foreground"
              >
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="1">Leídos</SelectItem>
                <SelectItem value="0">Sin leer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onCleanFilters}
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
          >
            <BrushCleaning className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
