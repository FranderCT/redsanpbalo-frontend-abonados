    import { useEffect, useState } from "react";
    import { useForm } from "@tanstack/react-form";
    import { toast } from "react-toastify";
    import { useCreateAvailabilityWaterRq } from "../../Request-Abonados/Hooks/AvailabilityWater/AvailabilityWaterHooks";
    import { uploadRequestAvailabilityWaterFile } from "../../Upload-files/Services/ProjectFileServices";
    import { ModalBase } from "../../../Components/Modals/ModalBase";
import type { AbonadoSearch } from "./Model";
import { useSearchAbonados } from "./GenralHook";

    /** =================== Helpers =================== **/

    export const uploadWithRetry = async (
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
        if (error?.response?.status === 429) {
            const retryAfter = error.response.headers["retry-after"];
            const delayMs = retryAfter
            ? parseInt(retryAfter) * 1000
            : Math.min(baseDelay * Math.pow(2, attempt), 10000);
            const jitter = delayMs * 0.25 * (Math.random() - 0.5);
            const finalDelay = Math.max(delayMs + jitter, 500);
            if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, finalDelay));
            continue;
            }
        }
        throw error;
        }
    }
    };

    const useDebouncedValue = (val: string, delay = 300) => {
    const [debounced, setDebounced] = useState(val);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(val), delay);
        return () => clearTimeout(id);
    }, [val, delay]);
    
    return debounced;
    
    };

    /** =================== Typeahead (buscar por cédula/NIS/nombre) =================== **/

    const UserTypeahead = ({
    value,
    onChange,
    }: {
    value?: number;
    onChange: (userId: number, picked?: AbonadoSearch) => void;
    }) => {
    const [input, setInput] = useState("");
    const [openList, setOpenList] = useState(false);

    const handleChange = (v: string) => {
        setInput(v);
        setOpenList(true);
    };
    

    const debounced = useDebouncedValue(input, 400);
    const { data: users = [], isPending } = useSearchAbonados(debounced);

    const selectedUser = users.find((u) => u.Id === value);

    return (
        <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Abonado (buscar por cédula/NIS) <span className="text-red-500">*</span>
        </label>

        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400">
            <input
            type="text"
            value={
                selectedUser
                ? `${selectedUser.IDcard ?? selectedUser.Nis ?? ""}`
                : input
            }
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setOpenList(true)}
            placeholder="Digite cédula, NIS o nombre…"
            className="w-full outline-none text-sm"
            />
            {value ? (
            <button
                type="button"
                onClick={() => {
                onChange(0, undefined);
                setInput("");
                }}
                className="text-gray-500 hover:text-gray-700 text-xs"
                title="Limpiar selección"
            >
                Limpiar
            </button>
            ) : null}
        </div>

        {openList && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
            {isPending ? (
                <div className="p-3 text-sm text-gray-500">Buscando…</div>
            ) : users.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                {input.trim() ? "Sin resultados" : "Escriba para buscar"}
                </div>
            ) : (
                users.map((u) => {
                const idShown = u.IDcard ?? u.Nis ?? "";
                return (
                    <button
                    key={u.Id}
                    type="button"
                    onClick={() => {
                        onChange(u.Id, u);
                        setInput(idShown);
                        setOpenList(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                    <div className="text-sm font-medium text-gray-900">
                        {u.FullName}
                    </div>
                    <div className="text-xs text-gray-500">
                        Cédula: {u.IDcard}
                        {u.Nis && ` • NIS: ${u.Nis}`}
                    </div>
                    </button>
                );
                })
            )}
            </div>
        )}
        </div>
    );
    };

    /** =================== Modal =================== **/

    const CreateAvailabilityWaterRqModalAmin = () => {
    const useCreateAvailabilityWaterRqMutation = useCreateAvailabilityWaterRq();
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");

    const form = useForm({
        defaultValues: {
        UserId: 0,
        Justification: "",
        fotocopiaCedula: [] as File[],
        copiaPlano: [] as File[],
        permisoMatricula: [] as File[],
        permisoMunicipal: [] as File[],
        _selectedUser: null as AbonadoSearch | null,
        },
        onSubmit: async ({ value, formApi }) => {
        try {
            if (!value.UserId || value.UserId <= 0) {
            toast.error("Seleccione un abonado antes de crear la solicitud.");
            return;
            }

            const requestData = { Justification: value.Justification, UserId: value.UserId };
            const requestResult = await useCreateAvailabilityWaterRqMutation.mutateAsync(requestData);
            const requestId = requestResult?.Id;
            if (!requestId) throw new Error("No se obtuvo el ID de la solicitud creada.");

            setIsUploading(true);

            const uploadTasks: Array<{ name: string; files: File[]; subfolder: string }> = [];
            if (value.fotocopiaCedula.length > 0)
            uploadTasks.push({ name: "Fotocopia de Cédula", files: value.fotocopiaCedula, subfolder: "Fotocopia-Cedula" });
            if (value.copiaPlano.length > 0)
            uploadTasks.push({ name: "Copia del Plano", files: value.copiaPlano, subfolder: "Copia-Plano" });
            if (value.permisoMatricula.length > 0)
            uploadTasks.push({ name: "Permiso de Construcción", files: value.permisoMatricula, subfolder: "Permiso-Construcción" });
            if (value.permisoMunicipal.length > 0)
            uploadTasks.push({ name: "Permiso Municipal", files: value.permisoMunicipal, subfolder: "Permiso-Municipal" });

            if (uploadTasks.length > 0) {
            let completedUploads = 0;
            for (const task of uploadTasks) {
                try {
                setUploadProgress(`Subiendo ${task.name}... (${completedUploads + 1}/${uploadTasks.length})`);
                await uploadWithRetry(() =>
                    uploadRequestAvailabilityWaterFile(requestId, task.files, task.subfolder, value.UserId)
                );
                completedUploads++;
                toast.info(`${task.name} subido exitosamente (${completedUploads}/${uploadTasks.length})`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                if (completedUploads < uploadTasks.length) await new Promise((r) => setTimeout(r, 500));
                } catch (error) {
                console.error(`Error subiendo ${task.name}:`, error);
                toast.error(`Error al subir ${task.name}. El documento no se guardó.`, {
                    position: "top-right",
                    autoClose: 5000,
                });
                }
            }
            toast.success(`Solicitud creada y ${completedUploads}/${uploadTasks.length} tipo(s) de documentos subidos exitosamente`, {
                position: "top-right",
                autoClose: 4000,
            });
            } else {
            toast.success("Solicitud de disponibilidad de agua creada exitosamente", {
                position: "top-right",
                autoClose: 3000,
            });
            }

            formApi.reset();
            setUploadProgress("");
            setOpen(false);
        } catch (error) {
            console.error("Error al crear la solicitud:", error);
            toast.error("Error al crear la solicitud. Intente nuevamente.", { position: "top-right", autoClose: 4000 });
        } finally {
            setIsUploading(false);
            setUploadProgress("");
        }
        },
    });

    const handleClose = () => {
        toast.warning("Solicitud cancelada", { position: "top-right", autoClose: 3000 });
        form.reset();
        setIsUploading(false);
        setUploadProgress("");
        setOpen(false);
    };

    const handleFileSelect = (files: FileList | null, fieldName: keyof typeof form.state.values) => {
        if (!files) return;
        const newFiles = Array.from(files);
        const validFiles: File[] = [];
        newFiles.forEach((file) => {
        if (file.size > 10 * 1024 * 1024) {
            toast.error(`El archivo "${file.name}" excede el tamaño máximo de 10MB`);
            return;
        }
        validFiles.push(file);
        });
        form.setFieldValue(fieldName, validFiles as any);
    };

    const handleRemoveFile = (fieldName: keyof typeof form.state.values, index: number) => {
        const currentFiles = form.getFieldValue(fieldName) as File[];
        const newFiles = currentFiles.filter((_, i) => i !== index);
        form.setFieldValue(fieldName, newFiles as any);
    };

    const FileField = ({
        fieldName,
        label,
        description,
    }: {
        fieldName: keyof typeof form.state.values;
        label: string;
        description: string;
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
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
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

        <form.Subscribe selector={(state) => state.values}>
            {(values) => {
            const files = (values as any)[fieldName] as File[] | undefined;
            return files && files.length > 0 ? (
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
            ) : null;
            }}
        </form.Subscribe>
        </div>
    );

    return (
        <div>
        {/* Botón de apertura (mismo estilo) */}
        <button onClick={() => setOpen(true)} className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition">
            + Solicitar Disponibilidad de Agua
        </button>

        <ModalBase
        open={open}
        onClose={handleClose}
        panelClassName="w-full max-w-4xl lg:max-w-5xl !p-0 overflow-hidden shadow-2xl max-h-[95vh]"
        >
            {/* Header (mismo estilo) */}
            <div className="px-6 py-5 text-[#091540] flex-shrink-0">
            <h3 className="text-xl font-semibold">Solicitud de Disponibilidad de Agua</h3>
            <p className="text-sm opacity-80">Complete la información y adjunte los documentos requeridos</p>
            </div>

            {/* Body (mismas paddings y gap) */}
            <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
            {/* Selector de abonado (con mismo look & feel general) */}
            <form.Field name="UserId">
                {(field) => (
                <UserTypeahead
                    value={field.state.value}
                    onChange={(userId, picked) => {
                    field.handleChange(userId);
                    form.setFieldValue("_selectedUser", picked ?? null);
                    }}
                />
                )}
            </form.Field>

            {/* Datos del abonado seleccionado */}
            <form.Subscribe selector={(state) => state.values._selectedUser}>
                {(selected) =>
                selected ? (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Datos del Solicitante</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                        <span className="text-xs text-gray-500">Cédula</span>
                        <p className="text-sm font-medium text-gray-800">{selected.IDcard ?? "-"}</p>
                        </div>
                        <div>
                        <span className="text-xs text-gray-500">NIS</span>
                        <p className="text-sm font-medium text-gray-800">{selected.Nis ?? "-"}</p>
                        </div>
                        <div>
                        <span className="text-xs text-gray-500">Email</span>
                        <p className="text-sm font-medium text-gray-800">{selected.Email ?? "-"}</p>
                        </div>
                        <div>
                        <span className="text-xs text-gray-500">Teléfono</span>
                        <p className="text-sm font-medium text-gray-800">{selected.PhoneNumber ?? "-"}</p>
                        </div>
                        <div className="md:col-span-2">
                        <span className="text-xs text-gray-500">Nombre completo</span>
                        <p className="text-sm font-medium text-gray-800">{selected.FullName}</p>
                        </div>
                        <div className="md:col-span-2">
                        <span className="text-xs text-gray-500">Dirección</span>
                        <p className="text-sm font-medium text-gray-800">{selected.Address ?? "-"}</p>
                        </div>
                    </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
                    Seleccione un abonado para ver sus datos.
                    </div>
                )
                }
            </form.Subscribe>

            {/* Justificación */}
            <form.Field name="Justification">
                {(field) => (
                <label className="grid gap-2">
                    <span className="text-sm font-medium text-gray-700">
                    Justificación de la solicitud <span className="text-red-500">*</span>
                    </span>
                    <textarea
                    className="w-full min-h-[100px] px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                    placeholder="Explique el motivo y la necesidad del servicio de agua en esta ubicación..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    required
                    />
                </label>
                )}
            </form.Field>

            {/* Documentos (mismo estilo general que el cuerpo) */}
            <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900">Documentos Requeridos</h3>
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
            description="Documento que autoriza la construcción en el terreno"
            />
            <FileField
            fieldName="permisoMunicipal"
            label="4. Permiso Municipal"
            description="Autorización municipal para la instalación del servicio"
            />
        </div>
            </div>

            {isUploading && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-blue-800">Procesando solicitud y subiendo documentos...</span>
                </div>
                {uploadProgress && <p className="text-xs text-blue-700">{uploadProgress}</p>}
                </div>
            )}

            {/* Footer (mismo estilo que el otro modal) */}
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                    type="submit"
                    className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition font-medium flex items-center justify-center gap-2"
                    disabled={!canSubmit || isSubmitting || isUploading}
                    >
                    {(isSubmitting || isUploading) && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmitting || isUploading ? uploadProgress || "Procesando..." : "Crear Solicitud"}
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
    };

    export default CreateAvailabilityWaterRqModalAmin;