import { useForm } from "@tanstack/react-form";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { useState } from "react";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateAssociatedRequest } from "../../Hooks/Associated/AssociatedRqHooks";
import { UploadAssociatedFiles } from "../../../Upload-files/Services/ProjectFileServices";

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

const CreateAssociatedRqModal = () => {
    const useCreateAssociatedRequestMutation = useCreateAssociatedRequest();
    const { UserProfile } = useGetUserProfile();
    const [open, setOpen] = useState(false);
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
            IDcard: UserProfile?.IDcard || '',
            Name: UserProfile?.Name || '',
            Justification: '',
            Surname1: UserProfile?.Surname1 || '',
            Surname2: UserProfile?.Surname2 || '',
            NIS: UserProfile?.Nis || 0,
            evidenciaBoletaFirmada: [] as File[],
        },
        onSubmit: async ({ value, formApi }) => {
            try {
                // 1. Crear la solicitud primero
                const requestData = {
                    IDcard: value.IDcard,
                    Name: value.Name,
                    Justification: value.Justification,
                    Surname1: value.Surname1,
                    Surname2: value.Surname2,
                    NIS: Number(value.NIS) || 0,
                };

                const requestResult = await useCreateAssociatedRequestMutation.mutateAsync(requestData);
                const requestId = requestResult?.Id;

                if (!requestId) throw new Error("No se obtuvo el ID de la solicitud creada.");

                // 2. Subir evidencia de boleta firmada si existe
                if (value.evidenciaBoletaFirmada.length > 0) {
                    setIsUploading(true);
                    setUploadProgress('Subiendo evidencia de boleta firmada...');

                    try {
                        await uploadWithRetry(
                            () => UploadAssociatedFiles(
                                requestId, 
                                value.evidenciaBoletaFirmada, 
                                'Evidencia-Boleta-Firmada', 
                                UserProfile?.Id
                            )
                        );

                        toast.success("Solicitud creada y evidencia de boleta firmada subida exitosamente", { 
                            position: "top-right", 
                            autoClose: 3000 
                        });
                    } catch (uploadError) {
                        console.error("Error subiendo evidencia:", uploadError);
                        toast.error("Solicitud creada, pero hubo un error al subir la evidencia. Intente subirla más tarde.", {
                            position: "top-right",
                            autoClose: 5000
                        });
                    }
                } else {
                    toast.success("Solicitud de asociado creada exitosamente", { 
                        position: "top-right", 
                        autoClose: 3000 
                    });
                }

                formApi.reset();
                setUploadProgress('');
                setOpen(false);
            } catch (error) {
                console.error("Error al crear la solicitud de asociado", error);
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



    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
            >
                + Solicitar Asociación
            </button>

            <ModalBase
                open={open}
                onClose={handleClose}
                panelClassName="w-full max-w-lg !p-0 overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="px-6 py-4 text-[#091540]">
                    <h3 className="text-xl font-semibold">Solicitud de Asociación</h3>
                    <p className="text-sm opacity-80">Sus datos se completarán automáticamente, solo escriba la justificación</p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Body */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="px-7 py-4 flex flex-col gap-4"
                >
                    {/* Datos del solicitante (autocompletados y de solo lectura) */}
                    {UserProfile && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos del Solicitante</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <span className="text-xs text-gray-500">Cédula</span>
                                    <p className="text-sm font-medium text-gray-800">{UserProfile.IDcard}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">NIS</span>
                                    <p className="text-sm font-medium text-gray-800">{UserProfile.Nis}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-xs text-gray-500">Nombre completo</span>
                                    <p className="text-sm font-medium text-gray-800">
                                        {UserProfile.Name} {UserProfile.Surname1} {UserProfile.Surname2}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 italic">
                                Estos datos se tomarán automáticamente de su perfil
                            </p>
                        </div>
                    )}

                    {/* Justificación - único campo editable */}
                    <form.Field name="Justification">
                        {(field) => (
                            <label className="grid gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Justificación de la solicitud de asociado <span className="text-red-500">*</span>
                                </span>
                                <textarea
                                    autoFocus
                                    className="w-full min-h-[120px] px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition shadow-sm resize-none"
                                    placeholder="Describa el motivo de su solicitud para ser asociado"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    rows={2}
                                    required
                                />
                                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Proporcione una justificación clara y detallada para su solicitud
                                </p>
                            </label>
                        )}
                    </form.Field>

                    {/* Campo de archivos para evidencia de boleta firmada */}
                    <form.Field name="evidenciaBoletaFirmada">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Evidencia de boleta firmada <span className="text-gray-500 text-xs">(Opcional)</span>
                                </label>
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                                    <label className="cursor-pointer block">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Seleccionar archivos</span>
                                                <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG, PNG (Máx. 10MB c/u)</p>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    const newFiles = Array.from(e.target.files);
                                                    const validFiles = newFiles.filter(file => {
                                                        if (file.size > 10 * 1024 * 1024) {
                                                            toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`);
                                                            return false;
                                                        }
                                                        return true;
                                                    });
                                                    field.handleChange(validFiles);
                                                }
                                            }}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                        />
                                    </label>
                                </div>

                                {/* Lista de archivos seleccionados */}
                                {field.state.value.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
                                        {field.state.value.map((file: File, index: number) => (
                                            <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newFiles = field.state.value.filter((_: File, i: number) => i !== index);
                                                        field.handleChange(newFiles);
                                                    }}
                                                    className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Footer */}
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
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

export default CreateAssociatedRqModal