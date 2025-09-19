import type { Supplier } from "../../Models/Supplier";


type Props = { data: Supplier };

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
}

export default function DetailsSupplierContainer({ data }: Props) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 text-[#091540]">
      {/* bloque principal en una sola columna, limpio y amplio */}
      <section className="space-y-8">
        <Field label="Nombre del Proveedor">
          {data?.Name || <Placeholder />}
        </Field>

        <Divider />

        <Field label="Correo Electrónico del Proveedor">
          {data?.Email || <Placeholder />}
        </Field>

        <Divider />

        <Field label="Número de teléfono del Proveedor">
          {data?.PhoneNumber || <Placeholder />}
        </Field>

        <Divider />

        <Field label="Dirección del Proveedor">
          {data?.Location || <Placeholder />}
        </Field>

        {/* <Divider /> */}

        {/* <Divider /> */}

        {/* <Field label="Estado del Proveedor">
          {data?.IsActive || <Placeholder />}
        </Field> */}

        <Divider />
        
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
