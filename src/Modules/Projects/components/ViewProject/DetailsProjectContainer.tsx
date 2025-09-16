import type { Project } from "../../Models/Project";

type Props = { data: Project };

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
}

export default function DetailsProjectContainer({ data }: Props) {
  return (
    <div className="w-full max-w-6xl h-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#091540]">
      {/* CONTENEDOR FLEX: columna en mobile, dos columnas en lg */}
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Columna principal (misma estructura) */}
        <section className="flex  min-w-0 space-y-6">
          <div className="flex flex-col gap-6 w-full">
            <label className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-semibold tracking-wide">Descripción del proyecto</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words">
                {data?.Description || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>

            <div className="border-t border-gray-200" />

            <label className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-semibold tracking-wide">Objetivo del proyecto</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words">
                {data?.Objective || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>

            <div className="border-t border-gray-200" />

            <label className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-semibold tracking-wide">Dirección</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words">
                {data?.Location || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>

            <div className="border-t border-gray-200" />

            {/* dos campos en fila usando flex en sm+ */}
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1 flex flex-col gap-1">
                <span className="text-sm sm:text-base font-semibold tracking-wide">Fecha de inicio</span>
                <div className="px-3 sm:px-4 py-2 border border-gray-300 text-sm sm:text-base">
                  {formatDate(data?.InnitialDate)}
                </div>
              </label>
              <label className="flex-1 flex flex-col gap-1">
                <span className="text-sm sm:text-base font-semibold tracking-wide">Fecha de fin</span>
                <div className="px-3 sm:px-4 py-2 border border-gray-300 text-sm sm:text-base">
                  {formatDate(data?.EndDate)}
                </div>
              </label>
            </div>

            <div className="border-t border-gray-200" />

            <label className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-semibold tracking-wide">Observaciones del proyecto</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base min-h-[80px] break-words">
                {data?.Observation || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>

            <div className="border-t border-gray-200" />

            <label className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-semibold tracking-wide">Espacio de documento</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 text-sm sm:text-base break-words">
                {data?.SpaceOfDocument || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>
          </div>
        </section>

        {/* Aside (misma estructura, sin fondos) */}
        <aside className="lg:w-[32%] lg:shrink-0 lg:self-start lg:sticky lg:top-6 max-h-[calc(100vh-3rem)] overflow-auto">
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3">Materiales asignados</h3>
            <div className="border border-gray-300 p-3 text-sm sm:text-base text-gray-600">
              Sin materiales asignados
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
