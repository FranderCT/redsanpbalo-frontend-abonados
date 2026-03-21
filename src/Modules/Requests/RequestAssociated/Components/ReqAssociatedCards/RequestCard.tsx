import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  FileText,
  Mail,
  MoreVertical,
  Phone,
  User,
} from "lucide-react";

export type RequestCardProps = {
  requestNumber: number | string;
  applicantName: string;
  requestType: string;
  status: string;
  activeStatus?: string;
  commentsEnabled?: boolean;
  date: string;
  nis: string | number;
  email: string;
  phone: string;
  justification?: string | null;
  className?: string;
  onMoreClick?: () => void;
};

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

function normalizeText(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getStatusTone(status?: string): Tone {
  const normalized = normalizeText(status);

  if (normalized.includes("aproba") || normalized.includes("activo")) return "success";
  if (normalized.includes("pend") || normalized.includes("proce")) return "warning";
  if (normalized.includes("rechaz") || normalized.includes("inactivo")) return "danger";
  if (normalized.includes("revision") || normalized.includes("tramite")) return "info";

  return "neutral";
}

function getBadgeClass(tone: Tone) {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "warning":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "danger":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "info":
      return "border-blue-200 bg-blue-50 text-blue-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function buildStatusBadges({
  status,
  activeStatus,
  commentsEnabled,
}: Pick<RequestCardProps, "status" | "activeStatus" | "commentsEnabled">) {
  const badges = [
    {
      label: status,
      tone: getStatusTone(status),
    },
  ];

  if (activeStatus) {
    badges.push({
      label: activeStatus,
      tone: getStatusTone(activeStatus),
    });
  }

  badges.push({
    label: commentsEnabled ? "Comentarios habilitados" : "Comentarios deshabilitados",
    tone: "neutral",
  });

  return badges;
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-medium uppercase tracking-[0.22em]">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function RequestCard({
  requestNumber,
  applicantName,
  requestType,
  status,
  activeStatus,
  commentsEnabled = false,
  date,
  nis,
  email,
  phone,
  justification,
  className,
  onMoreClick,
}: RequestCardProps) {
  const badges = buildStatusBadges({ status, activeStatus, commentsEnabled });
  const justificationText = justification?.trim() || "Sin justificación registrada";

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <CardHeader className="gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600">
              <User className="h-5 w-5" />
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-slate-500">
                # Solicitud #{requestNumber}
              </p>
              <h3 className="truncate text-lg font-semibold text-slate-950">{applicantName}</h3>
              <p className="text-sm text-slate-500">{requestType}</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            onClick={onMoreClick}
            aria-label="Más acciones"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge
              key={`${badge.label}-${badge.tone}`}
              variant="outline"
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.04em]",
                getBadgeClass(badge.tone),
              )}
            >
              {badge.label}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6 pt-0">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoBlock icon={CalendarDays} label="Fecha" value={date} />
          <InfoBlock icon={FileText} label="NIS" value={String(nis)} />
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
              Solicitante
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-950">{applicantName}</p>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="break-all">{email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{phone}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
              Justificación
            </p>
          </div>

          <p className="text-sm leading-6 text-slate-700">{justificationText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
