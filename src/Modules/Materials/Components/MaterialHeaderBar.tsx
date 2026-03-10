import { BrushCleaning, Search } from "lucide-react";
import type { ReactNode } from "react";
import type { MaterialStateFilter } from "../Models/Material";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

type Props = {
  limit: number;
  total: number;
  search: string;
  state: MaterialStateFilter;
  onLimitChange: (n: number) => void;
  onFilterChange: (state: MaterialStateFilter) => void;
  onSearchChange: (text: string) => void;
  onCleanFilters: () => void;
  rightAction?: ReactNode;
};

export default function MaterialHeaderBar({
  limit,
  total,
  search,
  state,
  onLimitChange,
  onFilterChange,
  onSearchChange,
  onCleanFilters,
  rightAction,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base text-[#091540]">Filtros de materiales</CardTitle>
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
            <span className="text-sm font-medium text-foreground">Filas por página</span>
            <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un límite" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-[160px] flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Estado</span>
            <Select value={state} onValueChange={(value) => onFilterChange(value as MaterialStateFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-[240px] flex-1 flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Buscar</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar por nombre"
                className="pl-9"
              />
            </div>
          </div>

          <Button type="button" variant="outline" size="icon" onClick={onCleanFilters} title="Limpiar filtros">
            <BrushCleaning className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
