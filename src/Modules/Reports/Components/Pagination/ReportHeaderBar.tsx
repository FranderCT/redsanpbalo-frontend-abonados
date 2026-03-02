"use client";

import { useState } from "react";
import { BrushCleaning, Filter, Search } from "lucide-react";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";

import type { ReportState } from "../../Models/ReportState";
import type { ReportType } from "../../Models/ReportType";
import type { ReportLocation } from "../../Models/ReportLocation";

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

type Props = {
  limit: number;
  total: number;
  search: string;
  stateId?: number;
  locationId?: number;
  reportTypeId?: number;
  reportStates: ReportState[];
  reportTypes: ReportType[];
  reportLocations: ReportLocation[];
  statesLoading?: boolean;
  typesLoading?: boolean;
  locationsLoading?: boolean;
  onStateChange: (id?: number) => void;
  onLocationChange: (id?: number) => void;
  onReportTypeChange: (id?: number) => void;
  onLimitChange: (n: number) => void;
  onSearchChange: (text: string) => void;
  onCleanFilters: () => void;
  rightAction?: ReactNode;
};

function FilterSelects({
  limit,
  stateId,
  locationId,
  reportTypeId,
  reportStates,
  reportTypes,
  reportLocations,
  statesLoading,
  typesLoading,
  locationsLoading,
  onStateChange,
  onLocationChange,
  onReportTypeChange,
  onLimitChange,
  onCleanFilters,
  onClose,
}: Props & { onClose?: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label>Filas por página</Label>
        <Select
          value={String(limit)}
          onValueChange={(v) => onLimitChange(Number(v))}
        >
          <SelectTrigger className="w-full">
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

      <div className="space-y-2">
        <Label>Estado</Label>
        <Select
          value={stateId != null ? String(stateId) : "all"}
          onValueChange={(v) =>
            onStateChange(v === "all" ? undefined : Number(v))
          }
          disabled={!!statesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={statesLoading ? "Cargando…" : "Todos"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {reportStates.map((s) => (
              <SelectItem key={s.IdReportState} value={String(s.IdReportState)}>
                {s.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tipo de reporte</Label>
        <Select
          value={reportTypeId != null ? String(reportTypeId) : "all"}
          onValueChange={(v) =>
            onReportTypeChange(v === "all" ? undefined : Number(v))
          }
          disabled={!!typesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={typesLoading ? "Cargando…" : "Todos"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {reportTypes.map((t) => (
              <SelectItem key={t.Id} value={String(t.Id)}>
                {t.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Ubicación</Label>
        <Select
          value={locationId != null ? String(locationId) : "all"}
          onValueChange={(v) =>
            onLocationChange(v === "all" ? undefined : Number(v))
          }
          disabled={!!locationsLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={locationsLoading ? "Cargando…" : "Todas"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {reportLocations.map((l) => (
              <SelectItem key={l.Id} value={String(l.Id)}>
                {l.Neighborhood}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            onCleanFilters();
            onClose?.();
          }}
        >
          <BrushCleaning className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
        {onClose && (
          <Button type="button" size="sm" onClick={onClose}>
            Aplicar
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ReportHeaderBar(props: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {
    limit,
    search,
    stateId,
    locationId,
    reportTypeId,
    reportStates,
    reportTypes,
    reportLocations,
    statesLoading,
    typesLoading,
    locationsLoading,
    onStateChange,
    onLocationChange,
    onReportTypeChange,
    onLimitChange,
    onSearchChange,
    onCleanFilters,
    rightAction,
  } = props;

  return (
    <div className="space-y-4">
      {/* Búsqueda + Filtros móvil + Acción principal */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1 w-full min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar reportes…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
            aria-label="Buscar reportes"
          />
        </div>

        {/* En móvil: botón Filtros que abre Sheet */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="default" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="pt-4 pb-8">
                <FilterSelects
                  {...props}
                  onClose={() => setFiltersOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>

          {rightAction}
        </div>
      </div>

      {/* Desktop: filtros en línea */}
      <div className="hidden md:flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="limit-select" className="text-sm text-muted-foreground whitespace-nowrap">
            Filas:
          </Label>
          <Select
            value={String(limit)}
            onValueChange={(v) => onLimitChange(Number(v))}
          >
            <SelectTrigger id="limit-select" className="w-[72px]">
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

        <div className="flex items-center gap-2">
          <Label htmlFor="state-select" className="text-sm text-muted-foreground whitespace-nowrap">
            Estado:
          </Label>
          <Select
            value={stateId != null ? String(stateId) : "all"}
            onValueChange={(v) =>
              onStateChange(v === "all" ? undefined : Number(v))
            }
            disabled={!!statesLoading}
          >
            <SelectTrigger id="state-select" className="w-[140px]">
              <SelectValue placeholder={statesLoading ? "Cargando…" : "Todos"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {reportStates.map((s) => (
                <SelectItem key={s.IdReportState} value={String(s.IdReportState)}>
                  {s.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="type-select" className="text-sm text-muted-foreground whitespace-nowrap">
            Tipo:
          </Label>
          <Select
            value={reportTypeId != null ? String(reportTypeId) : "all"}
            onValueChange={(v) =>
              onReportTypeChange(v === "all" ? undefined : Number(v))
            }
            disabled={!!typesLoading}
          >
            <SelectTrigger id="type-select" className="w-[140px]">
              <SelectValue placeholder={typesLoading ? "Cargando…" : "Todos"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {reportTypes.map((t) => (
                <SelectItem key={t.Id} value={String(t.Id)}>
                  {t.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="location-select" className="text-sm text-muted-foreground whitespace-nowrap">
            Ubicación:
          </Label>
          <Select
            value={locationId != null ? String(locationId) : "all"}
            onValueChange={(v) =>
              onLocationChange(v === "all" ? undefined : Number(v))
            }
            disabled={!!locationsLoading}
          >
            <SelectTrigger id="location-select" className="w-[160px]">
              <SelectValue placeholder={locationsLoading ? "Cargando…" : "Todas"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {reportLocations.map((l) => (
                <SelectItem key={l.Id} value={String(l.Id)}>
                  {l.Neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCleanFilters}
          title="Limpiar filtros"
          aria-label="Limpiar filtros"
        >
          <BrushCleaning className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
