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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 space-y-6 min-w-0">
          <div className="flex-1 ">
            <label className="flex flex-col gap-1 mb-4">
              <span className="text-sm sm:text-base font-medium">Descripción del proyecto</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words">
                {data?.Description || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>

            <label className="flex flex-col gap-1 mb-4">
              <span className="text-sm sm:text-base font-medium">Objetivo del proyecto</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words">
                {data?.Objective || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>

            <label className="flex flex-col gap-1 mb-4">
              <span className="text-sm sm:text-base font-medium">Dirección</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words">
                {data?.Location || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm sm:text-base font-medium">Fecha de inicio</span>
                <div className="px-3 sm:px-4 py-2 border border-gray-300 text-sm sm:text-base">
                  {formatDate(data?.InnitialDate)}
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm sm:text-base font-medium">Fecha de fin</span>
                <div className="px-3 sm:px-4 py-2 border border-gray-300 text-sm sm:text-base">
                  {formatDate(data?.EndDate)}
                </div>
              </label>
            </div>

            <label className="flex flex-col gap-1 mb-4">
              <span className="text-sm sm:text-base font-medium">Observaciones del proyecto</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base min-h-[80px] break-words">
                {data?.Observation || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-medium">Espacio de documento</span>
              <div className="px-3 sm:px-4 py-2 border border-gray-300 text-sm sm:text-base break-words">
                {data?.SpaceOfDocument || <span className="text-gray-400 italic">—</span>}
              </div>
            </label>
          </div>
        </section>

        <aside className="lg:col-span-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] overflow-auto">
          <div className=" p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Materiales asignados</h3>
            <div className="border p-3 text-sm sm:text-base text-gray-600">Sin materiales asignados</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
