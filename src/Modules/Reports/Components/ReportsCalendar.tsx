import { useMemo, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import type { DatesSetArg, EventClickArg } from "@fullcalendar/core";
import { useSearchReports } from "../Hooks/ReportsHooks";
import type { ReportListItem } from "../Models/Report";

function formatDateForApi(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type Props = {
  onViewDetails?: (report: ReportListItem) => void;
};

export default function ReportsCalendar({ onViewDetails }: Props) {
  const [range, setRange] = useState(() => ({
    startDate: formatDateForApi(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    endDate: formatDateForApi(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
  }));

  const query = useMemo(
    () => ({
      limit: 100,
      startDate: range.startDate,
      endDate: range.endDate,
      sortDir: "DESC" as const,
    }),
    [range.endDate, range.startDate]
  );

  const { data, isLoading, isError, error } = useSearchReports(query);
  const reports = data?.data ?? [];

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    setRange({
      startDate: formatDateForApi(arg.start),
      endDate: formatDateForApi(arg.end),
    });
  }, []);

  const events = useMemo(
    () =>
      reports.map((report) => ({
        id: String(report.Id),
        title: `${report.Code} - ${report.Description} - ${report.ReportedByDisplayName}`,
        start: new Date(report.CreatedAt),
        extendedProps: { report } as { report: ReportListItem },
      })),
    [reports]
  );

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const report = (info.event.extendedProps as { report: ReportListItem }).report;
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
          Cargando reportes...
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
