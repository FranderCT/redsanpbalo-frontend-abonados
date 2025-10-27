import { FileText, FileClock, FileCheck2, FileX2 } from "lucide-react";
import React from "react";

type Tone = "neutral" | "warning" | "success" | "danger"; // se mantiene por compatibilidad

// Estilos monocromos 
const monoStyles = {
  card: "group h-full border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-[1px]",
  headerText: "text-sm font-medium text-gray-500",
  iconWrap:
    "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200/70  h-9 w-9 inline-flex items-center justify-center",
  value: "leading-none text-[28px] font-semibold text-gray-900 tracking-tight",
  valueLoading:
    "animate-pulse text-transparent bg-gray-100  px-2 leading-none inline-block",
  badge:
    "mt-2 inline-flex w-fit items-center gap-2  border border-gray-200/70 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600",
  dot: "h-1.5 w-1.5 bg-gray-400",
  footerRow: "mt-4 flex items-end justify-between",
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  loading = false,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  tone?: Tone;
  loading?: boolean;
}) {
  const nfmt = new Intl.NumberFormat(); // formato de miles

  return (
    <div className={monoStyles.card}>
      <div className="flex items-start justify-between">
        <p className={monoStyles.headerText}>{title}</p>
        <span className={monoStyles.iconWrap}>{icon}</span>
      </div>

      <div className={monoStyles.footerRow}>
        <div className="flex flex-col gap-4">
          <span className={`${monoStyles.value} ${loading ? monoStyles.valueLoading : ""}`}>
            {loading ? "00" : nfmt.format(value)}
          </span>

          <span className={monoStyles.badge}>
            <span className={monoStyles.dot} />
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
        subtitle="Registradas"
        icon={<FileText size={18} />}
        loading={!!loading}
      />
      <StatCard
        title="Pendientes"
        value={pending}
        subtitle="Requieren atención"
        icon={<FileClock size={18} />}
        loading={!!loading}
      />
      <StatCard
        title="Aprobadas"
        value={approved}
        subtitle="Procesadas exitosamente"
        icon={<FileCheck2 size={18} />}
        loading={!!loading}
      />
      <StatCard
        title="Rechazadas"
        value={rejected}
        subtitle="No cumplen requisitos"
        icon={<FileX2 size={18} />}
        loading={!!loading}
      />
    </div>
  );
}
