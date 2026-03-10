import { BrushCleaning, Search } from "lucide-react";
import type { ReactNode } from "react";
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
import type { ProductStateFilter } from "../Models/CreateProduct";

type Props = {
  limit: number;
  total: number;
  search: string;
  state: ProductStateFilter;
  onLimitChange: (value: number) => void;
  onFilterChange: (value: ProductStateFilter) => void;
  onSearchChange: (value: string) => void;
  onCleanFilters: () => void;
  rightAction?: ReactNode;
};

export default function ProductHeaderBar({
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
          <CardTitle className="text-base text-[#091540]">Filtros de productos</CardTitle>
          <p className="text-sm text-slate-500">
            {total} {total === 1 ? "registro encontrado" : "registros encontrados"}
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          {rightAction}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="grid gap-3 md:grid-cols-[160px_180px_minmax(0,1fr)_auto] md:items-end">
          <div className="flex w-full flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Filas por página</span>
            <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un límite" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Estado</span>
            <Select value={state} onValueChange={(value) => onFilterChange(value as ProductStateFilter)}>
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

          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Buscar</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar por nombre, tipo u observación"
                className="pl-9"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onCleanFilters}
            title="Limpiar filtros"
            className="w-full md:w-9"
          >
            <BrushCleaning className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
