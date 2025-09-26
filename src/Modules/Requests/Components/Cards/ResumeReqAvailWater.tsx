import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  badgeClass,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  badgeClass?: string;
}) => {
  return (
    <div
      className="
        flex flex-column items-start justify-between gap-4
        border border-[#E6E8F0] bg-white p-4
        shadow-sm hover:shadow transition-shadow
      "
    >
      <div className="space-y-1">
        <p className="text-sm text-[#6B7280]">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-[#091540] leading-none">
            {value}
          </span>
          {subtitle && (
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                badgeClass ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div
        className="
          grid place-items-center border border-[#E6E8F0] p-2
          text-[#091540]/70 bg-[#F8FAFF]
        "
      >
        {icon}
      </div>
    </div>
  );
};

// Ejemplo de uso
export default function CardsDemo() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total de solicitudes"
        value={3}
        subtitle="Registradas"
        icon={<FileText size={20} />}
      />

      <StatCard
        title="Pendientes"
        value={1}
        subtitle="Requieren atención"
        badgeClass="bg-yellow-100 text-yellow-800"
        icon={<Clock size={20} />}
      />

      <StatCard
        title="Aprobadas"
        value={1}
        subtitle="Procesadas"
        badgeClass="bg-green-100 text-green-800"
        icon={<CheckCircle2 size={20} />}
      />

      <StatCard
        title="Rechazadas"
        value={1}
        subtitle="No cumplen requisitos"
        badgeClass="bg-red-100 text-red-800"
        icon={<XCircle size={20} />}
      />
    </div>
  );
}
