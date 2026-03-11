import { BrushCleaning, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
          {rightAction}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[160px_180px_minmax(0,1fr)_120px] xl:items-end">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="product-limit-select">Filas por página</Label>
            <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger id="product-limit-select" aria-label="Filas por página">
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
            <Label htmlFor="product-state-filter">Estado</Label>
            <Select value={state} onValueChange={(value) => onFilterChange(value as ProductStateFilter)}>
              <SelectTrigger id="product-state-filter" aria-label="Filtrar por estado">
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
            <Label htmlFor="product-search">Buscar</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="product-search"
                name="product-search"
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                autoComplete="off"
                placeholder="Buscar por nombre, tipo u observación"
                className="pl-9"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onCleanFilters}
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
            className="w-auto"
          >
            <BrushCleaning className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
