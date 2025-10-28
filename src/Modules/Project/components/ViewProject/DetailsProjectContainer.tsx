import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import type { Project } from "../../Models/Project";
import { Edit2 } from "lucide-react";
import CreateProjectTraceModal from "../../../Project_Trace/Components/CreateProjectTraceModal";
import { useNavigate } from "@tanstack/react-router";
import { useGetProjectTracesByProjectId, useGetTotalActualExpenseByProjectId } from "../../../Project_Trace/Hooks/ProjectTraceHooks";

type Props = { data: Project };

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
}

function calculateTraceExpense(trace: any): number {
  if (!trace?.ActualExpense?.ProductDetails) return 0;
  
  return trace.ActualExpense.ProductDetails.reduce((total: number, detail: any) => {
    return total + (detail.Quantity || 0);
  }, 0);
}

export default function DetailsProjectContainer({ data }: Props) {
  // ✅ Este ref apunta al MISMO contenedor que ya tenías, con las mismas clases
  const printRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  
  // Obtener seguimientos del proyecto
  const { projectTraces, isLoading: tracesLoading } = useGetProjectTracesByProjectId(data?.Id);
  
  // Obtener total de gastos actuales
  const { totalActualExpense, isLoading: totalExpenseLoading } = useGetTotalActualExpenseByProjectId(data?.Id);
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
            <div className="overflow-hidden rounded-lg shadow-sm border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r bg-[#091540]  text-white">
                    <th className="px-4 py-3 text-left font-semibold tracking-wide">Producto</th>
                    <th className="px-4 py-3 text-left font-semibold tracking-wide">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold tracking-wide">Cantidad</th>
                    <th className="px-4 py-3 text-left font-semibold tracking-wide">Categoría</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.ProjectProjection.ProductDetails.map((pd, index) => (
                    <tr key={pd.Id} className={` ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                      <td className="px-4 py-3 font-medium text-[#091540]">{pd.Product.Name}</td>
                      <td className="px-4 py-3 text-gray-700">{pd.Product?.Type} {pd.Product.Material?.Name}</td>
                      <td className="px-4 py-3 font-semibold text-[#091540]">{pd.Quantity}</td>
                      <td className="px-4 py-3 text-gray-700">{pd.Product.Category?.Name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Field>

          <Divider />

          <h4 className="text-2xl font-semibold tracking-wide">Comparativa: Proyección vs Gasto Real</h4>

          {totalExpenseLoading ? (
            <div className="text-center py-8">
              <p className="text-lg text-[#091540]/70">Cargando comparativa...</p>
            </div>
          ) : totalActualExpense && totalActualExpense.length > 0 ? (
            <div className="space-y-6">
              {totalActualExpense.map((expense: any) => (
                <div key={expense.Id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <h5 className="text-lg font-semibold text-[#091540] mb-4 flex items-center">
                    <span className="w-3 h-3 bg-[#1789FC] rounded-full mr-2"></span>
                    {expense.Description}
                  </h5>
                  
                  <div className="overflow-hidden rounded-lg shadow-md border border-blue-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#1789FC] to-[#1789FC]/80 text-white">
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Producto</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Tipo</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Proyectado</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Real Usado</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Diferencia</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-200 bg-white">
                        {expense.ProductDetails.map((detail: any, index: number) => {
                          // Buscar el producto correspondiente en la proyección
                          const projectedProduct = data.ProjectProjection.ProductDetails.find(
                            (pd) => pd.Product.Id === detail.Product.Id
                          );
                          const projectedQuantity = projectedProduct?.Quantity || 0;
                          const realQuantity = detail.Quantity;
                          const difference = realQuantity - projectedQuantity;
                          const isOverBudget = difference > 0;
                          const isOnTrack = difference === 0;
                          
                          return (
                            <tr key={detail.Id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-blue-50/30' : 'bg-white'}`}>
                              <td className="px-4 py-3 font-medium text-[#091540]">{detail.Product.Name}</td>
                              <td className="px-4 py-3 text-gray-700">{detail.Product.Type}</td>
                              <td className="px-4 py-3 font-semibold text-green-600 text-center">
                                <span className="bg-green-100 px-2 py-1 rounded-full">
                                  {projectedQuantity}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-[#1789FC] text-center">
                                <span className="bg-[#1789FC]/10 px-2 py-1 rounded-full">
                                  {realQuantity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`font-bold px-2 py-1 rounded-full ${
                                  isOnTrack 
                                    ? 'bg-green-100 text-green-800' 
                                    : isOverBudget 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {difference > 0 ? `+${difference}` : difference}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  isOnTrack 
                                    ? 'bg-green-100 text-green-800' 
                                    : isOverBudget 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {isOnTrack ? '✓ Exacto' : isOverBudget ? '⚠ Excedido' : '↓ Bajo presupuesto'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-[#091540]/70 mb-2">No hay datos de comparativa disponibles</p>
              <p className="text-sm text-[#091540]/50">La comparativa aparecerá cuando haya gastos reales registrados</p>
            </div>
          )}

          <Divider />

          <h4 className="text-2xl font-semibold tracking-wide">Seguimientos del proyecto</h4>

          {tracesLoading ? (
            <div className="text-center py-8">
              <p className="text-lg text-[#091540]/70">Cargando seguimientos...</p>
            </div>
          ) : projectTraces && projectTraces.length > 0 ? (
            <div className="space-y-6">
              {projectTraces.map((trace) => (
                <div key={trace.Id} className="border border-gray-300 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="text-xl font-semibold text-[#091540] mb-2">{trace.Name}</h5>
                      <p className="text-sm text-gray-600">Fecha: {formatDate(trace.date)}</p>
                      <p className="text-base text-[#091540] mt-2">{trace.Observation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#091540]">
                        Total gastado: {calculateTraceExpense(trace)} productos utilizados
                      </p>
                    </div>
                  </div>
                  
                  {trace.ActualExpense?.ProductDetails && trace.ActualExpense.ProductDetails.length > 0 && (
                    <div className="mt-6">
                      <h6 className="text-base font-semibold mb-4 text-[#091540] flex items-center">
                        <span className="w-2 h-2 bg-[#1789FC] rounded-full mr-2"></span>
                        Productos utilizados:
                      </h6>
                      <div className="overflow-hidden rounded-lg shadow-md border border-gray-200">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gradient-to-r from-[#091540] to-[#091540]/90 text-white">
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Producto</th>
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Tipo</th>
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Cantidad</th>
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Unidad</th>
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Categoría</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {trace.ActualExpense.ProductDetails.map((detail, index) => (
                              <tr key={detail.Id} className={` ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                                <td className="px-4 py-3 font-medium text-[#091540]">{detail.Product.Name}</td>
                                <td className="px-4 py-3 text-gray-700">{detail.Product.Type}</td>
                                <td className="px-4 py-3 font-bold text-[#091540] text-center">
                                  <span className="px-2 py-1 rounded-full">
                                    {detail.Quantity}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600 font-medium">{detail.Product.UnitMeasure?.Name || "—"}</td>
                                <td className="px-4 py-3">
                                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {detail.Product.Category?.Name || "—"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-[#091540]/70 mb-2">No hay seguimientos disponibles</p>
              <p className="text-sm text-[#091540]/50">Los seguimientos aparecerán aquí cuando se agreguen al proyecto</p>
            </div>
          )}

          <Divider />
                
                

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
