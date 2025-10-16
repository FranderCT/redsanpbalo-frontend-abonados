import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import type { Project } from "../../Models/Project";
import { Edit2 } from "lucide-react";
import CreateProjectTraceModal from "../../../Project_Trace/Components/CreateProjectTraceModal";
import { useNavigate } from "@tanstack/react-router";

type Props = { data: Project };

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
}

export default function DetailsProjectContainer({ data }: Props) {
  // ✅ Este ref apunta al MISMO contenedor que ya tenías, con las mismas clases
  const printRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  // ⬇️ react-to-print v3: usa contentRef
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Proyecto_${data?.Name ?? "detalle"}`,
    onAfterPrint: () => console.log("PDF generado"),
  });

  return (
    <>
      {/* Botón fuera del área a imprimir y oculto en PDF */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pt-6 print:hidden">
        <div className="flex justify-between">
          <div className="flex flex-row gap-8">
            <button
            onClick={() =>
              navigate({
                to: "/dashboard/projects/$projectId/edit",
                params: { projectId: String(data.Id) },
              })
            }
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium border text-[#1789FC] border-[#1789FC] hover:bg-[#1789FC] hover:text-white"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#1789FC] text-white hover:opacity-90"
          >
            Exportar a PDF
          </button>
          </div>
          
          <CreateProjectTraceModal ProjectId={data.Id}/>
        </div>  
        
      </div>

      {/* ⬇️ MISMO contenedor y estilos. Solo agrego ref={printRef} */}
      <div ref={printRef} className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 text-[#091540]">
        {/* bloque principal en una sola columna, limpio y amplio */}
        <section className="space-y-8">

          <h4 className="text-2xl font-semibold tracking-wide">Información del Proyecto</h4>

          <Field label="Encargado del Proyecto">
            {data?.User.Name || <Placeholder />} {data?.User.Surname1 || <Placeholder />} {data?.User.Surname2 || <Placeholder />}
          </Field>

          <Divider />

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

          {/* <Field label="Espacio de documento">
            {data?.SpaceOfDocument
              ? typeof data.SpaceOfDocument === "string"
                ? data.SpaceOfDocument
                : data.SpaceOfDocument instanceof File
                  ? data.SpaceOfDocument.name
                  : <Placeholder />
              : <Placeholder />}
          </Field> */}

          <Divider />

          <Field label="Estado del Proyecto">
            {data.ProjectState.Name}
          </Field>

          <Divider />

          <h4 className="text-2xl font-semibold tracking-wide">Proyección del Proyecto</h4>

          <Field label="Observación de la Proyección">
            {data.ProjectProjection.Observation}
          </Field>

          <Divider />

          <Field label="Estimado de productos a utilizar en el proyecto">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-[#1789FC]/70">
                  <th className="border px-2 py-1 text-left">Producto</th>
                  <th className="border px-2 py-1 text-left">Tipo</th>
                  <th className="border px-2 py-1 text-left">Cantidad</th>
                  <th className="border px-2 py-1 text-left">Categoría</th>
                </tr>
              </thead>
              <tbody>
                {data.ProjectProjection.ProductDetails.map((pd) => (
                  <tr key={pd.Id}>
                    <td className="border px-2 py-1">{pd.Product.Name}</td>
                    <td className="border px-2 py-1"> {pd.Product?.Type} {pd.Product.Material?.Name}</td>
                    <td className="border px-2 py-1">{pd.Quantity} </td>
                    <td className="border px-2 py-1">{pd.Product.Category?.Name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Field>

          <Divider />

          <h4 className="text-2xl font-semibold tracking-wide">Seguimientos del proyecto</h4>


                

        </section>
      </div>
    </>
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
