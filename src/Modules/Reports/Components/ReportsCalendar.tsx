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
        title: r.Code + " - " + r.Description + " - " + r.User.Name + " " + r.User.Surname1,
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
    <div className="reports-calendar min-w-0 max-w-full rounded-lg border border-border bg-card p-2 sm:p-4 overflow-x-auto">
      <style>{`
        .reports-calendar .fc-event {
          background: transparent !important;
          border-color: hsl(var(--border)) !important;
          color: hsl(var(--foreground)) !important;
        }
        .reports-calendar .fc-event:hover {
          background: hsl(var(--muted)) !important;
          border-color: hsl(var(--border)) !important;
        }
        /* Mobile: evita truncado en vista lista */
        .reports-calendar .fc-list-event-title,
        .reports-calendar .fc-list-event-dot {
          flex-shrink: 0;
        }
        .reports-calendar .fc-list-event-title {
          white-space: normal !important;
          word-break: break-word !important;
          overflow-wrap: anywhere;
          min-width: 0;
        }
        .reports-calendar .fc-list-day-text,
        .reports-calendar .fc-list-day-side-text {
          white-space: normal !important;
          word-break: break-word;
          font-size: clamp(0.75rem, 2.5vw, 0.875rem);
        }
        .reports-calendar .fc-toolbar-title {
          font-size: clamp(0.875rem, 3vw, 1.25rem) !important;
          white-space: normal;
          text-align: center;
        }
        .reports-calendar .fc-toolbar-chunk {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.25rem;
        }
        .reports-calendar .fc-button {
          padding: 0.25rem 0.5rem;
          font-size: 0.8125rem;
        }
      `}</style>
      {isLoading && (
        <div className="mb-2 text-center text-sm text-muted-foreground">
          Cargando reportes…
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin]}
        initialView="listWeek"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today listWeek",
        }}
        buttonText={{
          today: "Hoy",
          month: "Mes",
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
