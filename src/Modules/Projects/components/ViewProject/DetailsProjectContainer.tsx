import type { Project } from "../../Models/Project";

type Props = { data: Project };

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
}

export default function DetailsProjectContainer({ data }: Props) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 text-[#091540]">
      {/* bloque principal en una sola columna, limpio y amplio */}
      <section className="space-y-8">
        <Field label="Descripción del proyecto">
          {data?.Description || <Placeholder />}
        </Field>

        <Divider />

        <Field label="Objetivo del proyecto">
          {data?.Objective || <Placeholder />}
        </Field>

        <Divider />

        <Field label="Dirección">
          {data?.Location || <Placeholder />}
        </Field>

        <Divider />

        {/* Fechas en dos columnas en pantallas medianas+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Fecha de inicio">
            {formatDate(data?.InnitialDate)}
          </Field>
          <Field label="Fecha de fin">
            {formatDate(data?.EndDate)}
          </Field>
        </div>

        <Divider />

        <Field label="Observaciones del proyecto">
          {data?.Observation || <Placeholder />}
        </Field>

        <Divider />

        <Field label="Espacio de documento">
          {data?.SpaceOfDocument || <Placeholder />}
        </Field>

        <Divider />

        <Field label="Estado del Proyecto">
          {data.ProjectState.Name}
        </Field>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-base font-semibold tracking-wide">{label}</span>
      <div className="px-4 py-3 border border-gray-300 text-base leading-relaxed whitespace-pre-wrap break-words">
        {children}
      </div>
    </label>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200" />;
}

function Placeholder() {
  return <span className="text-gray-400 italic">—</span>;
}
