import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { useCreateAvailabilityWaterRq } from "../../Hooks/AvailabilityWater/AvailabilityWaterHooks";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { uploadRequestAvailabilityWaterFile } from "../../../Project-files/Services/ProjectFileServices";

// Helper function para manejar retry con rate limiting y respeto al Retry-After
const uploadWithRetry = async (
    uploadFn: () => Promise<any>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<any> => {
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            return await uploadFn();
        } catch (error: any) {
            attempt++;
            
            // Si es 429 (rate limit exceeded)
            if (error?.response?.status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                const delayMs = retryAfter ? 
                    parseInt(retryAfter) * 1000 : // Retry-After en segundos
                    Math.min(baseDelay * Math.pow(2, attempt), 10000); // Exponential backoff max 10s
                
                // Agregar jitter para evitar thundering herd (±25% random)
                const jitter = delayMs * 0.25 * (Math.random() - 0.5);
                const finalDelay = Math.max(delayMs + jitter, 500); // Mínimo 500ms
                
                console.log(`Rate limit hit, retrying in ${Math.round(finalDelay)}ms (attempt ${attempt}/${maxRetries})`);
                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, finalDelay));
                    continue;
                }
            }
            
            // Si no es 429 o se agotaron los reintentos, lanzar el error
            throw error;
        }
    }
};

const CreateAvailabilityWaterRqModal = () => {
    const useCreateAvailabilityWaterRqMutation = useCreateAvailabilityWaterRq();
    const { UserProfile } = useGetUserProfile();
    const [open, setOpen] = useState(false);

    // Estados para cada tipo de documento
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    const handleClose = () => {
        toast.warning("Solicitud cancelada", { position: "top-right", autoClose: 3000 });
        form.reset();
        setIsUploading(false);
        setUploadProgress('');
        setOpen(false);
    };

    const form = useForm({
        defaultValues: {
            Justification: '',
            // 4 campos de documentos separados
            fotocopiaCedula: [] as File[],
            copiaPlano: [] as File[],
            permisoMatricula: [] as File[],
            permisoMunicipal: [] as File[]
        },
        onSubmit: async ({ value, formApi }) => {
            try {
                // 1. Crear la solicitud primero - solo los campos requeridos
                const requestData = {
                    Justification: value.Justification,
                    UserId: UserProfile?.Id || 0
                };

                const requestResult = await useCreateAvailabilityWaterRqMutation.mutateAsync(requestData);
                const requestId = requestResult?.Id;

                if (!requestId) throw new Error("No se obtuvo el ID de la solicitud creada.");

                // 2. Subir documentos SECUENCIALMENTE para evitar 429 rate limit
                setIsUploading(true);
                const uploadTasks = [];

                // Definir las tareas de upload si hay archivos
                if (value.fotocopiaCedula.length > 0) {
                    uploadTasks.push({
                        name: 'Fotocopia de Cédula',
                        files: value.fotocopiaCedula,
                        subfolder: 'Fotocopia-Cedula'
                    });
                }
                if (value.copiaPlano.length > 0) {
                    uploadTasks.push({
                        name: 'Copia del Plano',
                        files: value.copiaPlano,
                        subfolder: 'Copia-Plano'
                    });
                }
                if (value.permisoMatricula.length > 0) {
                    uploadTasks.push({
                        name: 'Permiso de construcción',
                        files: value.permisoMatricula,
                        subfolder: 'Permiso-Construcción'
                    });
                }
                if (value.permisoMunicipal.length > 0) {
                    uploadTasks.push({
                        name: 'Permiso Municipal',
                        files: value.permisoMunicipal,
                        subfolder: 'Permiso-Municipal'
                    });
                }

                // Ejecutar uploads SECUENCIALMENTE con retry automático
                if (uploadTasks.length > 0) {
                    let completedUploads = 0;
                    
                    for (const task of uploadTasks) {
                        try {
                            setUploadProgress(`Subiendo ${task.name}... (${completedUploads + 1}/${uploadTasks.length})`);
                            
                            await uploadWithRetry(
                                () => uploadRequestAvailabilityWaterFile(
                                    requestId, 
                                    task.files, 
                                    task.subfolder, 
                                    UserProfile?.Id
                                )
                            );
                            
                            completedUploads++;
                            
                            // Mostrar progreso
                            toast.info(`${task.name} subido exitosamente (${completedUploads}/${uploadTasks.length})`, {
                                position: "top-right",
                                autoClose: 2000
                            });
                            
                            // Pequeña pausa entre uploads para ser amable con Dropbox
                            if (completedUploads < uploadTasks.length) {
                                await new Promise(resolve => setTimeout(resolve, 500));
                            }
                            
                        } catch (error) {
                            console.error(`Error subiendo ${task.name}:`, error);
                            toast.error(`Error al subir ${task.name}. El documento no se guardó.`, {
                                position: "top-right",
                                autoClose: 5000
                            });
                        }
                    }
                    
                    toast.success(`Solicitud creada y ${completedUploads}/${uploadTasks.length} tipo(s) de documentos subidos exitosamente`, { 
                        position: "top-right", 
                        autoClose: 4000 
                    });
                } else {
                    toast.success("Solicitud de disponibilidad de agua creada exitosamente", { 
                        position: "top-right", 
                        autoClose: 3000 
                    });
                }

                formApi.reset();
                setUploadProgress('');
                setOpen(false);
            } catch (error) {
                console.error("Error al crear la solicitud:", error);
                toast.error("Error al crear la solicitud. Intente nuevamente.", {
                    position: "top-right",
                    autoClose: 4000
                });
            } finally {
                setIsUploading(false);
                setUploadProgress('');
            }
        }
    });

    // Función helper para manejar selección de archivos
    const handleFileSelect = (files: FileList | null, fieldName: keyof typeof form.state.values) => {
        if (!files) return;
        
        const newFiles = Array.from(files);
        const validFiles: File[] = [];
        
        newFiles.forEach(file => {
            // Validar tamaño (máximo 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`);
                return;
            }
            validFiles.push(file);
        });
        
        form.setFieldValue(fieldName, validFiles as any);
    };

    // Función helper para remover archivo
    const handleRemoveFile = (fieldName: keyof typeof form.state.values, index: number) => {
        const currentFiles = form.getFieldValue(fieldName) as File[];
        const newFiles = currentFiles.filter((_, i) => i !== index);
        form.setFieldValue(fieldName, newFiles as any);
    };

    // Componente helper para campo de archivo
    const FileField = ({ fieldName, label, description }: { 
        fieldName: keyof typeof form.state.values, 
        label: string, 
        description: string 
    }) => (
        <div className="space-y-3">
            <div>
                <h4 className="text-sm font-semibold text-gray-800">{label}</h4>
                <p className="text-xs text-gray-600">{description}</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                <div className="text-center">
                    <label className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm text-gray-700">Seleccionar archivos</span>
                        </div>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files, fieldName)}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                        />
                    </label>
                </div>
            </div>

            {/* Lista de archivos */}
            <form.Subscribe selector={(state) => state.values}>
                {(values) => {
                    const files = (values as any)[fieldName] as File[] || [];
                    return files.length > 0 && (
                        <div className="space-y-2">
                            {files.map((file: File, index: number) => (
                                <div key={`${file.name}-${index}`} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(fieldName, index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    );
                }}
            </form.Subscribe>
        </div>
    );

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
            >
                + Solicitar Disponibilidad de Agua
            </button>

            <ModalBase
                open={open}
                onClose={handleClose}
                panelClassName="w-full max-w-4xl !p-0 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="px-6 py-4 text-[#091540] border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold">Solicitud de Disponibilidad de Agua</h3>
                    <p className="text-sm opacity-80">Complete la información y adjunte los documentos requeridos</p>
                </div>

                {/* Body */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="px-6 py-4 space-y-6"
                >
                    {/* Datos del solicitante */}
                    {UserProfile && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos del Solicitante</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <span className="text-xs text-gray-500">Cédula</span>
                                    <p className="text-sm font-medium text-gray-800">{UserProfile.IDcard}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Email</span>
                                    <p className="text-sm font-medium text-gray-800">{UserProfile.Email}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-xs text-gray-500">Nombre completo</span>
                                    <p className="text-sm font-medium text-gray-800">
                                        {UserProfile.Name} {UserProfile.Surname1} {UserProfile.Surname2}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* Justificación */}
                    <form.Field name="Justification">
                        {(field) => (
                            <label className="grid gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Justificación de la solicitud <span className="text-red-500">*</span>
                                </span>
                                <textarea
                                    className="w-full min-h-[100px] px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition shadow-sm"
                                    placeholder="Explique el motivo y la necesidad del servicio de agua en esta ubicación..."
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    rows={4}
                                    required
                                />
                                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                                    </p>
                                )}
                            </label>
                        )}
                    </form.Field>

                    {/* Documentos requeridos */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos Requeridos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileField 
                                fieldName="fotocopiaCedula" 
                                label="1. Fotocopia de Cédula" 
                                description="Fotocopia clara de la cédula del solicitante (ambas caras)"
                            />
                            <FileField 
                                fieldName="copiaPlano" 
                                label="2. Copia del Plano" 
                                description="Plano de la propiedad o construcción donde se instalará el servicio"
                            />
                            <FileField 
                                fieldName="permisoMatricula" 
                                label="3. Permiso de Construcción" 
                                description="Documento que autorise la construcción en el terreno"
                            />
                            <FileField 
                                fieldName="permisoMunicipal" 
                                label="4. Permiso Municipal" 
                                description="Autorización municipal para la instalación del servicio"
                            />
                        </div>
                    </div>

                    {/* Progreso de subida */}
                    {isUploading && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium text-blue-800">Procesando solicitud y subiendo documentos...</span>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition font-medium flex items-center justify-center gap-2"
                                    disabled={!canSubmit || isSubmitting || isUploading}
                                >
                                    {(isSubmitting || isUploading) && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {isSubmitting || isUploading ? 
                                        (uploadProgress || "Procesando...") : 
                                        "Crear Solicitud"
                                    }
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="h-10 px-6 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                                    disabled={isSubmitting || isUploading}
                                >
                                    Cancelar
                                </button>
                               
                            </div>
                        )}
                    </form.Subscribe>
                </form>
            </ModalBase>
        </div>
    );
}

export default CreateAvailabilityWaterRqModal