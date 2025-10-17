import { BrushCleaning } from 'lucide-react';
import type { ReactNode } from "react";

import type { ReportState } from '../../Models/ReportState';
import type { ReportType } from '../../Models/ReportType';
import type { ReportLocation } from '../../Models/ReportLocation';

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

export default function ReportHeaderBar({
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
  rightAction,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filas por página */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Filas por página:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Estado del reporte */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Estado:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={stateId || ""}
          onChange={(e) => {
            const v = e.target.value;
            onStateChange(v && !isNaN(Number(v)) ? Number(v) : undefined);
          }}
          disabled={!!statesLoading}
        >
          <option key="all-states" value="">{statesLoading ? "Cargando..." : "Todos"}</option>
          {reportStates.map(s => (
            <option key={s.IdReportState} value={s.IdReportState}>{s.Name}</option>
          ))}
        </select>
      </div>

      {/* Tipo de reporte */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Tipo:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={reportTypeId || ""}
          onChange={(e) => {
            const v = e.target.value;
            onReportTypeChange(v && !isNaN(Number(v)) ? Number(v) : undefined);
          }}
          disabled={!!typesLoading}
        >
          <option key="all-types" value="">{typesLoading ? "Cargando..." : "Todos"}</option>
          {reportTypes.map(t => (
            <option key={t.Id} value={t.Id}>{t.Name}</option>
          ))}
        </select>
      </div>

      {/* Ubicación */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#091540]">Ubicación:</span>
        <select
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm outline-none"
          value={locationId || ""}
          onChange={(e) => {
            const v = e.target.value;
            onLocationChange(v && !isNaN(Number(v)) ? Number(v) : undefined);
          }}
          disabled={!!locationsLoading}
        >
          <option key="all-locations" value="">{locationsLoading ? "Cargando..." : "Todas"}</option>
          {reportLocations.map(l => (
            <option key={l.Id} value={l.Id}>{l.Neighborhood}</option>
          ))}
        </select>
      </div>

      <div className="inline-flex items-center gap-2">
        <button
          onClick={onCleanFilters}
          className="h-9 px-3 border border-[#D9DBE9] bg-white text-sm hover:bg-gray-50 shrink-0"
          type="button"
          title="Limpiar filtros"
        >
          <BrushCleaning className="size-[23px]" />
        </button>
      </div>

      {/* Botón agregar alineado a la derecha */}
      <div className="ml-auto">
        {rightAction}
      </div>
    </div>
  );
}