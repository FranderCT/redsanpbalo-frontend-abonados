import { useMemo, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import type { DatesSetArg, EventClickArg } from "@fullcalendar/core";
import { useSearchReports } from "../Hooks/ReportsHooks";
import type { Report } from "../Models/Report";

function formatDateForApi(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getMonthRange(date: Date): { start: string; end: string } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start: formatDateForApi(start), end: formatDateForApi(end) };
}

type Props = {
  onViewDetails?: (report: Report) => void;
};

export default function ReportsCalendar({ onViewDetails }: Props) {
  const [range, setRange] = useState(() => getMonthRange(new Date()));

  const query = useMemo(
    () => ({
      limit: 100,
      startDate: range.start,
      endDate: range.end,
      sortDir: "DESC" as const,
    }),
    [range.start, range.end]
  );

  const { data, isLoading, isError, error } = useSearchReports(query);
  const reports = data?.data ?? [];

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    setRange({
      start: formatDateForApi(arg.start),
      end: formatDateForApi(arg.end),
    });
  }, []);

  const events = useMemo(
    () =>
      reports.map((r) => ({
        id: String(r.Id),
        title: r.Code,
        start: new Date(r.CreatedAt),
        extendedProps: { report: r } as { report: Report },
      })),
    [reports]
  );

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const report = (info.event.extendedProps as { report: Report }).report;
      if (report) onViewDetails?.(report);
    },
    [onViewDetails]
  );

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-muted/20 p-8">
        <p className="text-center text-destructive">
          {error?.message ?? "Error al cargar el calendario."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {isLoading && (
        <div className="mb-2 text-center text-sm text-muted-foreground">
          Cargando reportes…
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,listWeek",
        }}
        buttonText={{
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          list: "Lista",
        }}
        locale={esLocale}
        events={events}
        datesSet={handleDatesSet}
        eventClick={handleEventClick}
        height="auto"
        eventDisplay="block"
        dayMaxEvents={4}
        moreLinkClick="popover"
      />
    </div>
  );
}
