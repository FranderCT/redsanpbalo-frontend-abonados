import { CalendarDays, MapPin, User2 } from "lucide-react";
import { Separator } from "../../../../../Components/ui/separator";
import type { Project } from "../../../Models/Project";

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("es-CR");
}

type Props = { data: Project };

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function ProjectInfoSection({ data }: Props) {
  const fullName = [data.User?.Name, data.User?.Surname1, data.User?.Surname2]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      {/* Row de stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatItem icon={User2} label="Encargado" value={fullName} />
        <StatItem icon={CalendarDays} label="Inicio" value={formatDate(data.InnitialDate)} />
        <StatItem icon={CalendarDays} label="Fin" value={formatDate(data.EndDate)} />
        <StatItem icon={MapPin} label="Ubicación" value={data.Location} />
      </div>

      {/* Descripción del estado si existe */}
      {data.ProjectState?.Description && (
        <>
          <Separator />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Estado — </span>
            {data.ProjectState.Description}
          </p>
        </>
      )}
    </div>
  );
}
