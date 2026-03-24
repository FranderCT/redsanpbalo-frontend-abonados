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
import type { RequestState } from "../../../Requests/StateRequest/Model/RequestState";

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

export default function ReqChangeMeterUserHeaderBar({
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
    <Card className="rounded-none border border-slate-200 shadow-none">
      <CardHeader className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold text-[#091540]">
            Solicitudes registradas
          </CardTitle>
          <p className="text-sm text-slate-500">
            {total} {total === 1 ? "solicitud encontrada" : "solicitudes encontradas"}
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          {rightAction}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[160px_240px_minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-2">
            <Label htmlFor="req-change-meter-user-limit" className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Filas por página
            </Label>
            <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger id="req-change-meter-user-limit" className="rounded-none">
                <SelectValue placeholder="Selecciona un límite" />
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="req-change-meter-user-state" className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Estado
            </Label>
            <Select
              value={requestStateId ? String(requestStateId) : "all"}
              onValueChange={(value) => onStateRequestChange(value === "all" ? undefined : Number(value))}
              disabled={!!statesLoading}
            >
              <SelectTrigger id="req-change-meter-user-state" className="rounded-none">
                <SelectValue placeholder={statesLoading ? "Cargando..." : "Todos"} />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all">{statesLoading ? "Cargando..." : "Todos"}</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.Id} value={String(state.Id)}>
                    {state.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="req-change-meter-user-search" className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Buscar
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="req-change-meter-user-search"
                name="req-change-meter-user-search"
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                autoComplete="off"
                placeholder="Buscar por ubicación, justificación o estado"
                className="rounded-none pl-9"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mt-auto rounded-none"
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
