import { useQuery } from "@tanstack/react-query";
import apiAxios from "../../../../api/apiConfig";
import { useParams } from "@tanstack/react-router";
import { viewProjectRoute } from "../../Routes/ProjectsRoutes";
import CreateProjectTraceModal from "../../../Project_Trace/Components/CreateProjectTraceModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { uploadProjectFiles } from "../../../Upload-files/Services/ProjectFileServices";
import { 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Upload,
  FolderOpen,
  FileText,
  X,
  Eye,
  Package
} from "lucide-react";

export interface Project {
  Id: number;
  Name: string;
  Location: string;
  InnitialDate: Date;
  EndDate: Date;
  SpaceOfDocument: string;
  Objective: string;
  Description: string;
  Observation: string;
  IsActive: boolean;
  ProjectState: ProjectState;
  ProjectProjection: ProjectProjection;
  User: User;
  TraceProject: TraceProject[];
  TotalActualExpense: TotalActualExpense;
}

export interface ProjectState {
  Id: number;
  Name: string;
  Description: string;
  IsActive: boolean;
}

export interface ProjectProjection {
  Id: number;
  Observation: string;
  ProductDetails: ProductDetail[];
}

export interface ProductDetail {
  Id: number;
  Quantity: number;
  Product: Product;
}

export interface Product {
  Id: number;
  Name: string;
  Type: string;
  Observation: string;
  IsActive: boolean;
  Category: Category;
  UnitMeasure: UnitMeasure;
}

export interface Category {
  Id: number;
  Name: string;
  Description: string;
  IsActive: boolean;
}

export interface UnitMeasure {
  Id: number;
  Name: string;
  IsActive: boolean;
}

export interface User {
  Id: number;
  IDcard: string;
  Name: string;
  Surname1: string;
  Surname2: string;
  ProfilePhoto: string | null;
  Nis: number[];
  Email: string;
  PhoneNumber: string;
  Birthdate: Date;
  Address: string;
  IsActive: boolean;
  Password: string;
}

export interface TraceProject {
  Id: number;
  Name: string;
  date: Date;
  Observation: string;
  IsActive: boolean;
  ActualExpense: ActualExpense;
}

export interface ActualExpense {
  Id: number;
  date: Date;
  Observation: string;
  IsActive: boolean;
  ProductDetails: ProductDetail[];
}

export interface TotalActualExpense {
  Id: number;
  Description: string;
  ProductDetails: ProductDetail[];
}

export async function getProjectById(projectId: number): Promise<Project | null> {
  const { data } = await apiAxios.get<Project>(`/project/${projectId}`);
  return data;
}

export const useGetProjectById = (projectId: number) => {
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId),
  });
  return { project, isLoading, error };
};

const ViewProjectById = () => {
  const { projectId } = useParams({ from: viewProjectRoute.id });
  const projectIdNumber = Number(projectId);
  const { project, isLoading, error } = useGetProjectById(projectIdNumber);

  // Estados para manejo de archivos
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingFolderLink, setIsGettingFolderLink] = useState(false);

  const formatDate = (d?: Date | string | null) => {
    if (!d) return "—";
    try {
      const dt = new Date(d as any);
      if (isNaN(dt.getTime())) return "—";
      return dt.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return "—";
    }
  };

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
  };

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
      await uploadProjectFiles(projectIdNumber, uploadedFiles);
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
      const response = await apiAxios.get(
        `/project-file/folder-link/${projectIdNumber}`
      );
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-center text-red-900 mb-2">Error al cargar</h3>
          <p className="text-center text-red-700">No se pudo cargar el proyecto. Intenta nuevamente.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'EN PROGRESO': 'bg-blue-100 text-blue-800 border-blue-200',
      'COMPLETADO': 'bg-green-100 text-green-800 border-green-200',
      'CANCELADO': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status?.toUpperCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 text-sm font-medium border ${getStatusColor(project?.ProjectState?.Name || '')}`}>
                  {project?.ProjectState?.Name}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium">
                  ID: #{project?.Id}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[#091540] mb-2">
                {project?.Name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{project?.Location}</span>
              </div>
            </div>
            <CreateProjectTraceModal ProjectId={projectIdNumber} />
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1789FC] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Encargado</p>
                  <p className="text-[#091540] font-medium">{project?.User?.Name} {project?.User?.Surname1}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1789FC] flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fecha de Inicio</p>
                  <p className="text-[#091540] font-medium">{formatDate(project?.InnitialDate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1789FC] flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fecha de Fin</p>
                  <p className="text-[#091540] font-medium">{formatDate(project?.EndDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Descripción y Objetivo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-[#1789FC]" />
              <h3 className="text-lg font-bold text-[#091540]">Descripción</h3>
            </div>
            <p className="text-gray-600">{project?.Description || 'Sin descripción disponible'}</p>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-[#1789FC]" />
              <h3 className="text-lg font-bold text-[#091540]">Objetivo</h3>
            </div>
            <p className="text-gray-600">{project?.Objective || 'Sin objetivo especificado'}</p>
          </div>
        </div>

        {/* Proyección de Productos */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[#1789FC]" />
            <h3 className="text-lg font-bold text-[#091540]">Proyección de Productos</h3>
          </div>

          {project?.ProjectProjection?.ProductDetails && project.ProjectProjection.ProductDetails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.ProjectProjection.ProductDetails.map((pd) => (
                <div key={pd.Id} className="bg-gray-50 border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-[#091540]">
                      {pd.Product?.Name}
                    </h4>
                    <span className="px-2 py-1 bg-[#1789FC] text-white text-sm font-bold">
                      {pd.Quantity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{pd.Product?.Type}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1">
                      {pd.Product?.Category?.Name}
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1">
                      {pd.Product?.UnitMeasure?.Name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay productos proyectados</p>
            </div>
          )}
        </div>

        {/* Comparativa */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#1789FC]" />
            <h3 className="text-lg font-bold text-[#091540]">Comparativa: Proyección vs Real</h3>
          </div>

          {(() => {
            const proj = project?.ProjectProjection?.ProductDetails ?? [];
            const used = project?.TotalActualExpense?.ProductDetails ?? [];

            if (proj.length === 0 && used.length === 0) {
              return (
                <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No hay datos para comparar</p>
                </div>
              );
            }

            const map = new Map<string, { product: any; projected: number; used: number }>();

            proj.forEach((p) => {
              const key = p?.Product?.Id ? `id:${p.Product.Id}` : `name:${p?.Product?.Name ?? Math.random()}`;
              const existing = map.get(key) ?? { product: p.Product, projected: 0, used: 0 };
              existing.projected = Number(p.Quantity ?? 0);
              if (!existing.product) existing.product = p.Product;
              map.set(key, existing);
            });

            used.forEach((u) => {
              const key = u?.Product?.Id ? `id:${u.Product.Id}` : `name:${u?.Product?.Name ?? Math.random()}`;
              const existing = map.get(key) ?? { product: u.Product, projected: 0, used: 0 };
              existing.used += Number(u.Quantity ?? 0);
              if (!existing.product) existing.product = u.Product;
              map.set(key, existing);
            });

            const rows = Array.from(map.values());

            return (
              <div className="border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#091540] text-white">
                        <th className="px-4 py-3 text-left font-semibold">Producto</th>
                        <th className="px-4 py-3 text-center font-semibold">Proyectado</th>
                        <th className="px-4 py-3 text-center font-semibold">Utilizado</th>
                        <th className="px-4 py-3 text-center font-semibold">Diferencia</th>
                        <th className="px-4 py-3 text-center font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rows.map((r, i) => {
                        const diff = Number(r.used || 0) - Number(r.projected || 0);
                        const percentage = r.projected > 0 ? ((r.used / r.projected) * 100) : 0;
                        
                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-[#091540]">{r.product?.Name ?? '—'}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 font-semibold">
                                {r.projected}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block px-2 py-1 bg-[#1789FC] text-white font-semibold">
                                {r.used}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 font-bold ${
                                diff === 0 
                                  ? 'bg-green-100 text-green-700 border border-green-200' 
                                  : diff > 0 
                                    ? 'bg-red-100 text-red-700 border border-red-200' 
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}>
                                {diff === 0 ? <Minus className="w-4 h-4" /> : diff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {diff > 0 ? `+${diff}` : diff}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-full max-w-[100px] bg-gray-200 h-2">
                                  <div 
                                    className={`h-2 ${
                                      percentage <= 100 ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Seguimientos */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-[#1789FC]" />
            <h3 className="text-lg font-bold text-[#091540]">Seguimientos del Proyecto</h3>
          </div>

          {project?.TraceProject && project.TraceProject.length > 0 ? (
            <div className="space-y-4">
              {project.TraceProject.map((t, index) => (
                <div 
                  key={t.Id} 
                  className="bg-gray-50 border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 bg-[#1789FC] text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="text-lg font-bold text-[#091540]">
                          {t.Name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{t.Observation}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(t.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {t.ActualExpense?.ProductDetails?.length ?? 0} productos
                        </span>
                      </div>
                    </div>
                  </div>

                  {t.ActualExpense?.ProductDetails && t.ActualExpense.ProductDetails.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-[#091540] mb-3">Productos utilizados:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {t.ActualExpense.ProductDetails.map((d) => (
                          <div key={d.Id} className="flex items-center justify-between bg-white border border-gray-200 p-3">
                            <span className="text-sm text-gray-700">{d.Product?.Name ?? '—'}</span>
                            <span className="px-2 py-1 bg-[#1789FC] text-white text-sm font-bold">
                              {d.Quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay seguimientos registrados</p>
            </div>
          )}
        </div>

        {/* Sección de Documentos */}
        <div className="bg-white border border-gray-200 p-6">
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

        {/* Observaciones */}
        {project?.Observation && (
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#1789FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-[#091540]">Observaciones</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{project.Observation}</p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default ViewProjectById;