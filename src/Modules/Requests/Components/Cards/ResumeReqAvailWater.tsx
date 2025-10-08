import { FileText, Clock, CheckCircle2, XCircle, FileClock, FileCheck2, FileX2 } from "lucide-react";
import React from "react";

type Tone = "neutral" | "warning" | "success" | "danger";

const toneStyles: Record<
  Tone,
  { iconWrap: string; badge: string; value: string; border: string }
> = {
  neutral: {
    iconWrap: "bg-gray-100 text-gray-700",
    badge: "bg-gray-100 text-gray-700",
    value: "text-[#091540]",
    border: "border-gray-200",
  },
  warning: {
    iconWrap: "bg-yellow-100 text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800",
    value: "text-[#091540]",
    border: "border-yellow-100",
  },
  success: {
    iconWrap: "bg-green-100 text-green-700",
    badge: "bg-green-100 text-green-800",
    value: "text-[#091540]",
    border: "border-green-100",
  },
  danger: {
    iconWrap: "bg-red-100 text-red-700",
    badge: "bg-red-100 text-red-800",
    value: "text-[#091540]",
    border: "border-red-100",
  },
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = "neutral",
  loading = false,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  tone?: Tone;
  loading?: boolean;
}) {
  const t = toneStyles[tone];
  return (
    <div
      className={`group h-full border ${t.border} bg-white p-5 shadow-sm transition
                  hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[#6B7280]">{title}</p>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${t.iconWrap}`}
        >
          {icon}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className="flex flex-col">
          <span
            className={`leading-none text-3xl font-bold ${t.value} ${
              loading ? "animate-pulse text-transparent bg-gray-100 rounded-md px-2" : ""
            }`}
          >
            {loading ? "00" : value}
          </span>

          <span
            className={`mt-2 inline-flex w-fit items-center gap-1  px-2.5 py-1 text-xs font-semibold ${t.badge}`}
          >
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ResumeReqAvailWater({
  total,
  pending,
  approved,
  rejected,
  loading,
}: {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  loading?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total de solicitudes"
        value={total}
        subtitle="Registradas en el sistema"
        icon={<FileText size={18} />}
        tone="neutral"
        loading={!!loading}
      />
      <StatCard
        title="Pendientes"
        value={pending}
        subtitle="Requieren atención"
        icon={<FileClock size={18} />}
        tone="warning"
        loading={!!loading}
      />
      <StatCard
        title="Aprobadas"
        value={approved}
        subtitle="Procesadas exitosamente"
        icon={<FileCheck2 size={18} />}
        tone="success"
        loading={!!loading}
      />
      <StatCard
        title="Rechazadas"
        value={rejected}
        subtitle="No cumplen requisitos"
        icon={<FileX2 size={18} />}
        tone="danger"
        loading={!!loading}
      />
    </div>
  );
}
