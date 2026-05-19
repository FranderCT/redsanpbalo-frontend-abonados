"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

type Props = {
  limit: number;
  total: number;
  search: string;
  state?: string;
  onLimitChange: (n: number) => void;
  onFilterClick: (value: string) => void;
  onSearchChange: (text: string) => void;
  onCleanFilters: () => void;
  rightAction?: ReactNode;
};

function UserFilterSelects({
  state,
  onFilterClick,
}: Pick<Props, "state" | "onFilterClick">) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="filter-state">Estado del usuario</Label>
        <Select
          value={state === undefined || state === "" ? "all" : state}
          onValueChange={(v) => onFilterClick(v === "all" ? "" : v)}
        >
          <SelectTrigger id="filter-state" className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="1">Activo</SelectItem>
            <SelectItem value="0">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default function UserHeaderBar({
  limit,
  search,
  state,
  onLimitChange,
  onFilterClick,
  onSearchChange,
  onCleanFilters,
  rightAction,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1 w-full min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar usuarios…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
            aria-label="Buscar usuarios"
          />
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-2 sm:flex-shrink-0">
          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <Label htmlFor="limit-select" className="text-sm text-muted-foreground whitespace-nowrap">
              Filas:
            </Label>
            <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
              <SelectTrigger id="limit-select" className="w-[88px] sm:w-[72px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="default" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm p-0">
              <SheetHeader className="px-6 pt-6 pb-4">
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 pb-4">
                <UserFilterSelects state={state} onFilterClick={onFilterClick} />
              </div>
              <SheetFooter className="flex flex-col gap-2 p-4">
                <div className="w-full flex flex-col-reverse gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      onCleanFilters();
                      setFiltersOpen(false);
                    }}
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setFiltersOpen(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {rightAction ? <div className="w-full sm:w-auto">{rightAction}</div> : null}
        </div>
      </div>
    </div>
  );
}
