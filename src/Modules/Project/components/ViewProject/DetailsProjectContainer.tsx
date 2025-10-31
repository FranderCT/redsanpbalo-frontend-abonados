import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Edit2, Upload, FolderOpen } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import axios from "axios";
import CreateProjectTraceModal from "../../../Project_Trace/Components/CreateProjectTraceModal";
import { uploadProjectFiles } from "../../../Upload-files/Services/ProjectFileServices";
import type { Project } from "../../Models/Project";
import { useGetProjectTracesByProjectId, useGetTotalActualExpenseByProjectId } from "../../../Project_Trace/Hooks/ProjectTraceHooks";


type Props = { data: Project };

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
}

export default function DetailsProjectContainer({ data }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Estados para upload de archivos
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingFolderLink, setIsGettingFolderLink] = useState(false);
  
  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
  };

  // Si el objeto `data` no trae TraceProject o TotalActualExpense, consultamos los endpoints
  const {
    projectTraces: fetchedTraces,
    isLoading: tracesLoading,
  } = useGetProjectTracesByProjectId(data?.Id);

  const {
    totalActualExpense: fetchedTotal,
    isLoading: totalExpenseLoading,
  } = useGetTotalActualExpenseByProjectId(data?.Id);

  // Preferir los datos que vienen en `data` (cuando backend los incluye),
  // sino usar lo que devolvieron las queries.
  const tracesToRender = data.TraceProject && data.TraceProject.length > 0 ? data.TraceProject : (fetchedTraces ?? []);
  // Filtrar por el projectId para evitar que el endpoint devuelva trazas de otros proyectos
  const tracesFiltered = tracesToRender.filter((t: any) => {
    const projectIdFromTrace = t?.Project?.Id ?? t?.ProjectId ?? t?.projectId ?? null;
    return Number(projectIdFromTrace) === Number(data.Id);
  });
  const totalToRender = data.TotalActualExpense ?? fetchedTotal ?? null;

  // Resumen agregado: calcular filas resumen (producto, proyectado, utilizado, diferencia)
  const summaryRows = React.useMemo(() => {
    if (!totalToRender?.ProductDetails) return [] as Array<any>;
    const map = new Map<number, { product: any; projected: number; used: number }>();

    // Agregar los productos del total (usados)
    totalToRender.ProductDetails.forEach((detail: any) => {
      const pid = detail?.Product?.Id ?? Math.random();
      const existing = map.get(pid) ?? { product: detail.Product, projected: 0, used: 0 };
      existing.used += Number(detail.Quantity || 0);
      map.set(pid, existing);
    });

    // Completar con cantidades proyectadas si existen en ProjectProjection
    (data.ProjectProjection?.ProductDetails ?? []).forEach((pd: any) => {
      const pid = pd?.Product?.Id ?? Math.random();
      const existing = map.get(pid) ?? { product: pd.Product, projected: 0, used: 0 };
      existing.projected = Number(pd.Quantity || 0);
      // si product no estaba en map, asegurar product esté presente
      if (!map.has(pid)) map.set(pid, existing);
    });

    return Array.from(map.values());
  }, [totalToRender, data.ProjectProjection]);

  const totals = React.useMemo(() => {
    return summaryRows.reduce(
      (acc, r) => {
        acc.projected += Number(r.projected || 0);
        acc.used += Number(r.used || 0);
        return acc;
      },
      { projected: 0, used: 0 }
    );
  }, [summaryRows]);

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUploadFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Selecciona al menos un archivo para subir");
      return;
    }

    setIsUploading(true);
    try {
      await uploadProjectFiles(data.Id, uploadedFiles);
      toast.success("Archivos subidos exitosamente");
      setUploadedFiles([]);
    } catch (error) {
      toast.error("Error al subir los archivos");
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const navigateToProjectFolder = async () => {
    setIsGettingFolderLink(true);
    try {
      const response = await axios.get(`http://localhost:3000/project-file/folder-link/${data.Id}`);
      const dropboxUrl = response.data;
      
      if (typeof dropboxUrl === 'string' && dropboxUrl.includes('dropbox.com')) {
        window.open(dropboxUrl, '_blank');
      } else {
        toast.error("No se pudo obtener el enlace de la carpeta");
      }
    } catch (error) {
      console.error("Error al obtener el enlace de la carpeta:", error);
      toast.error("Error al abrir la carpeta del proyecto");
    } finally {
      setIsGettingFolderLink(false);
    }
  };
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Proyecto_${data.Name}`,
    onAfterPrint: () => console.log("PDF generado"),
  });

  return (
    <>
      {/* Botones de acción */}
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

      {/* Contenido imprimible */}
      <div ref={printRef} className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 text-[#091540]">
        <section className="space-y-8">

          <h4 className="text-2xl font-semibold tracking-wide">Información del Proyecto</h4>

          <Field label="Nombre del Proyecto">
            {data.Name || <Placeholder />}
          </Field>

          <Divider />

          <Field label="Encargado del Proyecto">
            {data.User?.Name || <Placeholder />} {data.User?.Surname1 || ""} {data.User?.Surname2 || ""}
          </Field>

          <Divider />

          <Field label="Descripción del proyecto">
            {data.Description || <Placeholder />}
          </Field>

          <Divider />

          <Field label="Objetivo del proyecto">
            {data.Objective || <Placeholder />}
          </Field>

          <Divider />

          <Field label="Dirección">
            {data.Location || <Placeholder />}
          </Field>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Fecha de inicio">
              {formatDate(data.InnitialDate)}
            </Field>
            <Field label="Fecha de fin">
              {formatDate(data.EndDate)}
            </Field>
          </div>

          <Divider />

          <Field label="Observaciones del proyecto">
            {data.Observation || <Placeholder />}
          </Field>

          <Divider />

          <Field label="Estado del Proyecto">
            {data.ProjectState?.Name || <Placeholder />}
          </Field>

          <Divider />

          <h4 className="text-2xl font-semibold tracking-wide">Proyección del Proyecto</h4>

          <Field label="Observación de la Proyección">
            {data.ProjectProjection?.Observation || <Placeholder />}
          </Field>

          <Divider />

          <Field label="Estimado de productos a utilizar en el proyecto">
            {data.ProjectProjection?.ProductDetails && data.ProjectProjection.ProductDetails.length > 0 ? (
              <div className="overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#091540] to-[#091540]/90 text-white">
                      <th className="px-4 py-3 text-left font-semibold tracking-wide">Nombre del Producto</th>
                      <th className="px-4 py-3 text-left font-semibold tracking-wide">Tipo y Material</th>
                      <th className="px-4 py-3 text-left font-semibold tracking-wide">Cantidad Estimada</th>
                      <th className="px-4 py-3 text-left font-semibold tracking-wide">Categoría del Producto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.ProjectProjection.ProductDetails.map((pd: any, index: number) => (
                      <tr key={pd.Id} className={`${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                        <td className="px-4 py-3 font-medium text-[#091540]">{pd.Product?.Name || "—"}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {pd.Product?.Type || ""} {pd.Product?.Material?.Name || ""}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#091540]">{pd.Quantity}</td>
                        <td className="px-4 py-3 text-gray-700">{pd.Product?.Category?.Name || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay productos estimados</p>
            )}
          </Field>

          <Divider />

          <Field label="Total Gastado">
            {totalExpenseLoading ? (
              <div className="text-center py-8">
                <p className="text-lg text-[#091540]/70">Cargando comparativa...</p>
              </div>
            ) : totalToRender && totalToRender.ProductDetails && totalToRender.ProductDetails.length > 0 ? (
              <div className="space-y-6">
                <div key={totalToRender.Id} className="bg-gradient-to-r rounded-lg"> 
                  <div className="overflow-hidden rounded-lg shadow-md border border-blue-200">
                    <div className="px-4 py-3">
                      <p className="font-semibold text-[#091540]">{totalToRender.Description}</p>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#091540] to-[#091540]/90 text-white">
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Nombre del Producto</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Tipo</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Cantidad Proyectada</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Cantidad Utilizada</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Diferencia</th>
                          <th className="px-4 py-3 text-left font-semibold tracking-wide">Estado del Presupuesto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {totalToRender.ProductDetails.map((detail: any, index: number) => {
                          const projectedProduct = data.ProjectProjection?.ProductDetails?.find(
                            (pd: any) => pd.Product?.Id === detail.Product?.Id
                          );
                          const projectedQuantity = projectedProduct?.Quantity || 0;
                          const realQuantity = detail.Quantity || 0;
                          const difference = realQuantity - projectedQuantity;
                          const isOverBudget = difference > 0;
                          const isOnTrack = difference === 0;
                          
                          return (
                            <tr key={detail.Id} className={`${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                              <td className="px-4 py-3 font-medium text-[#091540]">{detail.Product?.Name || "—"}</td>
                              <td className="px-4 py-3 text-gray-700">{detail.Product?.Type || "—"}</td>
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
                {/* Resumen del Total Gastado: tabla agregada */}
                {summaryRows && summaryRows.length > 0 && (
                  <div className="mt-6">
                    <h6 className="text-base font-semibold mb-4 text-[#091540]">Resumen del Total Gastado</h6>
                    <div className="overflow-hidden rounded-lg shadow-sm border border-gray-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#091540] text-white">
                            <th className="px-4 py-3 text-left font-semibold tracking-wide">Producto</th>
                            <th className="px-4 py-3 text-left font-semibold tracking-wide">Cantidad Proyectada</th>
                            <th className="px-4 py-3 text-left font-semibold tracking-wide">Cantidad Utilizada</th>
                            <th className="px-4 py-3 text-left font-semibold tracking-wide">Diferencia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {summaryRows.map((row: any, i: number) => {
                            const diff = Number(row.used || 0) - Number(row.projected || 0);
                            return (
                              <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                                <td className="px-4 py-3 font-medium text-[#091540]">{row.product?.Name || '—'}</td>
                                <td className="px-4 py-3 text-gray-700 text-center font-semibold">{row.projected}</td>
                                <td className="px-4 py-3 text-[#1789FC] text-center font-semibold">{row.used}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`font-bold px-2 py-1 rounded-full ${
                                    diff === 0 ? 'bg-green-100 text-green-800' : diff > 0 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                  }`}>{diff > 0 ? `+${diff}` : diff}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100">
                            <td className="px-4 py-3 font-semibold">Totales</td>
                            <td className="px-4 py-3 font-semibold text-center">{totals.projected}</td>
                            <td className="px-4 py-3 font-semibold text-center">{totals.used}</td>
                            <td className="px-4 py-3 font-semibold text-center">{totals.used - totals.projected}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-[#091540]/70 mb-2">No hay datos de comparativa disponibles</p>
                <p className="text-sm text-[#091540]/50">La comparativa aparecerá cuando haya gastos reales registrados</p>
              </div>
            )}
          </Field>

          <Divider />

          <h4 className="text-2xl font-semibold tracking-wide">Seguimientos del proyecto</h4>

          {tracesLoading ? (
            <div className="text-center py-8">
              <p className="text-lg text-[#091540]/70">Cargando seguimientos...</p>
            </div>
          ) : tracesFiltered && tracesFiltered.length > 0 ? (
            <div className="space-y-6">
              {tracesFiltered.map((trace: any) => (
                <div key={trace.Id} className="border border-gray-300 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="text-xl font-semibold text-[#091540] mb-2">{trace.Name}</h5>
                      <p className="text-sm text-gray-600">Fecha: {formatDate(trace.date)}</p>
                      <p className="text-base text-[#091540] mt-2">{trace.Observation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#091540]">
                        Total gastado: {trace.ActualExpense?.ProductDetails?.reduce((sum: number, pd: any) => sum + (pd.Quantity || 0), 0) || 0} productos utilizados
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
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Nombre del Producto</th>
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Tipo y Material</th>
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Cantidad Utilizada</th>
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Unidad de Medida</th>
                              <th className="px-4 py-3 text-left font-semibold tracking-wide">Categoría del Producto</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {trace.ActualExpense.ProductDetails.map((detail: any, index: number) => (
                              <tr key={detail.Id} className={`${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                                <td className="px-4 py-3 font-medium text-[#091540]">{detail.Product?.Name || "—"}</td>
                                <td className="px-4 py-3 text-gray-700">{detail.Product?.Type || ""}</td>
                                <td className="px-4 py-3 font-bold text-[#091540] text-center">
                                  <span className="bg-[#091540]/10 px-2 py-1 rounded-full">
                                    {detail.Quantity}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600 font-medium">{detail.Product?.UnitMeasure?.Name || "—"}</td>
                                <td className="px-4 py-3">
                                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {detail.Product?.Category?.Name || "—"}
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
          
          {/* Sección de documentos - No se imprime */}
          <div className="print:hidden">
            <div className="">
              <h3 className="text-xl font-bold text-[#091540] mb-6 text-center">Documentos del Proyecto</h3>
              
              <div className="w-full mx-auto space-y-6">
                {/* Drag and Drop Area */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1789FC] transition-colors bg-white"
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleFileUpload(files);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                >
                  <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Arrastra y suelta archivos aquí
                  </p>
                  <p className="text-sm text-gray-500 mb-6">o</p>
                  <label className="inline-flex items-center px-6 py-3 bg-[#1789FC] text-white rounded-lg cursor-pointer hover:bg-[#1789FC]/90 transition-colors font-medium">
                    <Upload className="w-5 h-5 mr-2" />
                    Seleccionar Archivos
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(e.target.files);
                        }
                      }}
                      accept="*/*"
                    />
                  </label>
                </div>

                {/* Lista de archivos seleccionados */}
                {uploadedFiles.length > 0 && (
                  <div className="rounded-lg p-4 border w-full">
                    <h4 className="font-semibold text-gray-700 mb-3">Archivos seleccionados ({uploadedFiles.length}):</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-3 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botones de acción centrados */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleUploadFiles}
                    disabled={uploadedFiles.length === 0 || isUploading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#1789FC] text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#1789FC]/90 transition-colors font-medium"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Subiendo archivos...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Subir Documentos {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
                      </>
                    )}
                  </button>

                  <button
                    onClick={navigateToProjectFolder}
                    disabled={isGettingFolderLink}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#1789FC] text-[#1789FC] rounded-lg hover:bg-[#1789FC] hover:text-white transition-colors font-medium disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isGettingFolderLink ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                        Obteniendo enlace...
                      </>
                    ) : (
                      <>
                        <FolderOpen className="w-5 h-5" />
                        Ver Carpeta del Proyecto
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
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