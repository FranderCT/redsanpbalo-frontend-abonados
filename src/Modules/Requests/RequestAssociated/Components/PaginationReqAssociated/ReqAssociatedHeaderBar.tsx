import { BrushCleaning, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
import type { RequestState } from "../../../StateRequest/Model/RequestState";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;

type Props = {
  limit: number;
  total: number;
  search: string;
  requestStateId?: number;
  states: RequestState[];
  statesLoading?: boolean;
  onStateRequestChange: (id?: number) => void;
  onLimitChange: (n: number) => void;
  onSearchChange: (text: string) => void;
  onCleanFilters: () => void;
  rightAction?: ReactNode;
};

export default function ReqAssociatedHeaderBar({
  total,
  limit,
  search,
  requestStateId,
  states,
  statesLoading,
  onStateRequestChange,
  onLimitChange,
  onSearchChange,
  onCleanFilters,
  rightAction,
}: Props) {
  return (
    <Card className="border shadow-none rounded-none">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base text-[#091540]">Filtros de solicitudes</CardTitle>
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
            <Label htmlFor="req-associated-limit">Filas por pagina</Label>
            <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger id="req-associated-limit" className="rounded-none">
                <SelectValue placeholder="Selecciona un limite" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2">
            <Label htmlFor="req-associated-request-state">Estado de la solicitud</Label>
            <Select
              value={requestStateId ? String(requestStateId) : "all"}
              onValueChange={(value) => onStateRequestChange(value === "all" ? undefined : Number(value))}
              disabled={!!statesLoading}
            >
              <SelectTrigger id="req-associated-request-state" className="rounded-none">
                <SelectValue placeholder={statesLoading ? "Cargando..." : "Todos"} />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all">{statesLoading ? "Cargando..." : "Todos"}</SelectItem>
                {states.map((s) => (
                  <SelectItem key={s.Id} value={String(s.Id)}>
                    {s.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-[260px] flex-1 flex-col gap-2">
            <Label htmlFor="req-associated-search">Buscar</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="req-associated-search"
                name="req-associated-search"
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                autoComplete="off"
                placeholder="Buscar por solicitante o justificacion"
                className="rounded-none pl-9"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-none"
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
