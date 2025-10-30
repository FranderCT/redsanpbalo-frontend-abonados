    import { useForm } from "@tanstack/react-form";

    import { useEffect, useState } from "react";
    import { toast } from "react-toastify";
    import type { AbonadoSearch } from "../../../GeneralGetUser/Model";
    import { useSearchAbonados } from "../../../GeneralGetUser/GenralHook";
    import { useCreateAssociatedRequest } from "../../../../Request-Abonados/Hooks/Associated/AssociatedRqHooks";
    import { useGetUserProfile } from "../../../../Users/Hooks/UsersHooks";
    import { UploadAssociatedFiles } from "../../../../Upload-files/Services/ProjectFileServices";
    import { ModalBase } from "../../../../../Components/Modals/ModalBase";


    /** ============ Helper: retry con respeto a Retry-After ============ */
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

    /** ============ Helper debounce ============ */
    const useDebouncedValue = (val: string, delay = 400) => {
    const [debounced, setDebounced] = useState(val);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(val), delay);
        return () => clearTimeout(id);
    }, [val, delay]);
    return debounced;
    };

    /** ============ Typeahead (cédula/NIS/nombre) ============ */
    const UserTypeahead = ({
    value,
    onChange,
    }: {
    value?: number;
    onChange: (userId: number, picked?: AbonadoSearch) => void;
    }) => {
    const [input, setInput] = useState("");
    const [openList, setOpenList] = useState(false);

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
            value={selectedUser ? `${selectedUser.IDcard ?? selectedUser.Nis ?? ""}` : input}
            onChange={(e) => {
                setInput(e.target.value);
                setOpenList(true);
            }}
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
                    <div className="text-sm font-medium text-gray-900">{u.FullName}</div>
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

    /** ============ Modal ============ */
    const CreateAssociatedRqModal = () => {
    const useCreateAssociatedRequestMutation = useCreateAssociatedRequest();
    const { UserProfile } = useGetUserProfile();
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");

    const form = useForm({
        defaultValues: {
        // Datos de perfil como fallback; se actualizarán con el abonado seleccionado
        IDcard: UserProfile?.IDcard || "",
        Name: UserProfile?.Name || "",
        Surname1: UserProfile?.Surname1 || "",
        Surname2: UserProfile?.Surname2 || "",
        NIS: UserProfile?.Nis || 0, // solo lectura en UI
        Justification: "",
        evidenciaBoletaFirmada: [] as File[],
        UserId: 0, // para el typeahead
        _selectedUser: null as AbonadoSearch | null,
        },
        onSubmit: async ({ value, formApi }) => {
        try {
            if (!value._selectedUser) {
            toast.error("Seleccione un abonado válido.");
            return;
            }
            if (!value.Justification.trim()) {
            toast.error("La justificación es requerida.");
            return;
            }
            if (!value.NIS || Number(value.NIS) <= 0) {
            toast.error("El abonado no tiene NIS válido.");
            return;
            }

            // 1) Crear solicitud
            const requestData = {
            IDcard: value.IDcard, // puede venir del abonado o del perfil (si el abonado no trae)
            Name: value.Name || UserProfile?.Name || "",
            Surname1: value.Surname1 || UserProfile?.Surname1 || "",
            Surname2: value.Surname2 || UserProfile?.Surname2 || "",
            NIS: Number(value.NIS) || 0, // tomado del abonado seleccionado
            Justification: value.Justification.trim(),
            };

            const requestResult = await useCreateAssociatedRequestMutation.mutateAsync(requestData);
            const requestId = requestResult?.Id;
            if (!requestId) throw new Error("No se obtuvo el ID de la solicitud creada.");

            // 2) Subir evidencia si hay
            if (value.evidenciaBoletaFirmada.length > 0) {
            setIsUploading(true);
            setUploadProgress("Subiendo evidencia de boleta firmada...");

            try {
                await uploadWithRetry(() =>
                UploadAssociatedFiles(
                    requestId,
                    value.evidenciaBoletaFirmada,
                    "Evidencia-Boleta-Firmada",
                    UserProfile?.Id
                )
                );
                toast.success("Solicitud creada y evidencia subida exitosamente", { position: "top-right", autoClose: 3000 });
            } catch (uploadError) {
                console.error("Error subiendo evidencia:", uploadError);
                toast.error("Solicitud creada, pero ocurrió un error al subir la evidencia. Intente más tarde.", {
                position: "top-right",
                autoClose: 5000,
                });
            }
            } else {
            toast.success("Solicitud de asociación creada exitosamente", { position: "top-right", autoClose: 3000 });
            }

            formApi.reset();
            setUploadProgress("");
            setOpen(false);
        } catch (error) {
            console.error("Error al crear la solicitud de asociado", error);
            toast.error("Error al crear la solicitud. Intente nuevamente.", {
            position: "top-right",
            autoClose: 4000,
            });
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
            panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
            {/* Header */}
            <div className="px-6 py-5 text-[#091540]">
            <h3 className="text-xl font-semibold">Solicitud de Asociación</h3>
            <p className="text-sm opacity-80">Busque su abonado, verifique NIS y adjunte evidencia (opcional)</p>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 py-4"></div>
            <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
            {/* Selector de abonado */}
            <form.Field name="UserId">
                {(field) => (
                <UserTypeahead
                    value={field.state.value}
                    onChange={(userId, picked) => {
                    field.handleChange(userId);
                    form.setFieldValue("_selectedUser", picked ?? null);

                    // Actualizar NIS solo desde el abonado (UI solo lectura)
                    const nisNum = picked?.Nis ? Number(picked.Nis) : 0;
                    form.setFieldValue("NIS", Number.isNaN(nisNum) ? 0 : nisNum);

                    // Si el abonado trae cédula, úsala; si no, mantén la del perfil
                    if (picked?.IDcard) {
                        form.setFieldValue("IDcard", picked.IDcard);
                    }
                    }}
                />
                )}
            </form.Field>

            {/* Tarjeta de información básica del abonado */}
            <form.Subscribe selector={(s) => s.values._selectedUser}>
                {(sel) =>
                sel ? (
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="font-medium text-gray-900">{sel.FullName}</div>
                    <div className="text-gray-600">
                        Cédula: <span className="font-mono">{sel.IDcard ?? "—"}</span>
                        {sel.Nis ? (
                        <>
                            {" "}
                            • NIS: <span className="font-mono">{sel.Nis}</span>
                        </>
                        ) : null}
                    </div>
                    {sel.Address ? <div className="text-gray-600">Dirección: {sel.Address}</div> : null}
                    {sel.PhoneNumber? <div className="text-gray-600">Teléfono: {sel.PhoneNumber}</div> : null}
                    </div>
                ) : null
                }
            </form.Subscribe>

            {/* NIS SOLO LECTURA */}
            <form.Field name="NIS">
                {(field) => (
                <label className="grid gap-2">
                    <span className="text-sm font-medium text-gray-700">NIS (solo lectura)</span>
                    <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-md"
                    value={field.state.value ? String(field.state.value) : ""}
                    readOnly
                    disabled
                    />
                </label>
                )}
            </form.Field>

            {/* Justificación (único campo editable de texto) */}
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
                    <p className="text-xs text-gray-500">Proporcione una justificación clara y detallada para su solicitud</p>
                </label>
                )}
            </form.Field>

            {/* Evidencia de boleta firmada */}
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
                            const validFiles = newFiles.filter((file) => {
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
                    {isSubmitting || isUploading ? uploadProgress || "Procesando..." : "Crear Solicitud"}
                    </button>
                    <button
                    type="button"
                    onClick={() => {
                        toast.warning("Solicitud cancelada", { position: "top-right", autoClose: 3000 });
                        form.reset();
                        setIsUploading(false);
                        setUploadProgress("");
                        setOpen(false);
                    }}
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

    export default CreateAssociatedRqModal;
