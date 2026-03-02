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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";

import type { ReportState } from "../../Models/ReportState";
import type { ReportType } from "../../Models/ReportType";
import type { ReportLocation } from "../../Models/ReportLocation";

const PAGE_SIZES = [3, 6, 9, 12, 15] as const;

type Props = {
  limit: number;
  totalItems: number;
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
  onSearchChange: (text: string) => void;
  onStateChange: (id?: number) => void;
  onLocationChange: (id?: number) => void;
  onReportTypeChange: (id?: number) => void;
  onLimitChange: (n: number) => void;
  onCleanFilters: () => void;
  rightAction?: ReactNode;
};

function FilterSelects({
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
}: Props & { onClose?: () => void }) {
  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}

export default function ReportHeaderBar(props: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { search, limit, onSearchChange, onLimitChange, onCleanFilters, rightAction } = props;

  return (
    <div className="space-y-4">
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
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Label htmlFor="limit-select" className="text-sm text-muted-foreground whitespace-nowrap">
              Filas:
            </Label>
            <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
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
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="default">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm p-0">
              <SheetHeader className="px-6 pt-6 pb-4">
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 pb-4">
                <FilterSelects {...props} />
              </div>
              <SheetFooter className="flex flex-col gap-2 p-4">
                <div className="w-full flex flex-col-reverse gap-2 ">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full "
                    onClick={() => {
                      onCleanFilters();
                      setFiltersOpen(false);
                    }}
                  >

                    Limpiar filtros
                  </Button>
                  <Button
                    type="button"
                    className="w-full "
                    onClick={() => setFiltersOpen(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {rightAction}
        </div>
      </div>
    </div>
  );
}
