    import { useEffect, useState } from "react";
    import { toast } from "react-toastify";
    import type { ReqChangeNameMeter } from "../../Models/RequestChangeNameMeter";
    import { useGetAllRequestStates, useUpdateReqChangeNameMeter, useUpdateCanCommentChangeNameMeter } from "../../Hooks/RequestChangeNameMeterHooks";


    type Props = {
    open: boolean;
    req: ReqChangeNameMeter | null;
    onClose: () => void;
    onSuccess?: () => void;
    };

    export default function UpdateReqChangeNameMeterStateModal({
    open,
    req,
    onClose,
    onSuccess,
    }: Props) {
    const { requestStates = [], isPending, error } = useGetAllRequestStates();
    const updateMutation = useUpdateReqChangeNameMeter();
    const updateCanCommentMutation = useUpdateCanCommentChangeNameMeter();

    const [stateId, setStateId] = useState<number | "">("");
    const [canComment, setCanComment] = useState<boolean>(false);

    useEffect(() => {
        if (!req) return;
        const current = req.StateRequest?.Id;
        setStateId(current ? Number(current) : "");
        const initialCanComment = req.CanComment ?? false;
        console.log('📋 Modal abierto - CanComment:', initialCanComment, 'Request:', req);
        setCanComment(initialCanComment);
    }, [req, req?.CanComment]);

    if (!open || !req) return null;

    const busy = updateMutation.isPending || updateCanCommentMutation.isPending;

    const handleToggleCanComment = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (busy) return;
        
        const newValue = !canComment;
        console.log('🔄 Cambiando CanComment:', { actual: canComment, nuevo: newValue, requestId: req.Id });
        
        setCanComment(newValue);
        
        try {
            const result = await updateCanCommentMutation.mutateAsync({
                id: req.Id,
                canComment: newValue,
            });
            console.log('✅ CanComment actualizado en servidor:', result);
            toast.success(
                newValue 
                    ? "Comentarios habilitados para el abonado" 
                    : "Comentarios deshabilitados para el abonado",
                { position: "top-right", autoClose: 3000 }
            );
        } catch (err: any) {
            console.error('❌ Error al actualizar CanComment:', err);
            setCanComment(!newValue);
            toast.error(err?.response?.data?.message || "No se pudo actualizar el permiso de comentarios");
        }
    };

    const handleCancel = () => {
        toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
        onClose();
    };

    const handleConfirm = async () => {
        if (!stateId) {
        toast.warn("Selecciona un estado", { position: "top-right", autoClose: 2500 });
        return;
        }
        try {
        await updateMutation.mutateAsync({
            id: req.Id,
            data: { StateRequestId: Number(stateId) },
        });
        toast.success("Estado actualizado");
        onSuccess?.();
        onClose();
        } catch (err) {
        console.error("Error al actualizar estado:", err);
        toast.error("No se pudo actualizar el estado");
        }
    };

    return (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40">
        <div className="w-[95%] max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-[#091540]">Editar estado</h3>

            <div className="mb-4 space-y-1 text-sm text-gray-700">
            <p>
                <span className="text-gray-500">Solicitante: </span>
                <b>
                {`${req.User?.Name ?? ""} ${req.User?.Surname1 ?? ""} ${req.User?.Surname2 ?? ""}`.trim() || "-"}
                </b>
            </p>
            </div>

            <label className="mb-1 block text-sm font-medium text-[#091540]">Estado</label>
            {isPending ? (
            <div className="mb-4 rounded border border-gray-200 p-3 text-sm text-gray-600">Cargando estados…</div>
            ) : error ? (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                No se pudieron cargar los estados.
            </div>
            ) : (
            <select
                className="mb-4 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#1789FC]"
                value={stateId}
                onChange={(e) => setStateId(e.target.value ? Number(e.target.value) : "")}
                disabled={busy}
            >
                <option value="">Seleccione un estado…</option>
                {requestStates.map((s) => (
                <option key={s.Id} value={s.Id}>
                    {s.Name}
                </option>
                ))}
            </select>
            )}

            {/* Control de permisos de comentarios */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-[#091540] mb-2">
                    Permisos de comentarios
                </label>
                <p className="text-xs text-gray-600 mb-3">
                    {canComment 
                        ? "El abonado puede ver y agregar comentarios a esta solicitud" 
                        : "El abonado no puede acceder a los comentarios de esta solicitud"}
                </p>
                
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onMouseDown={handleToggleCanComment}
                        disabled={busy}
                        className={`
                            px-4 py-2 text-sm font-medium rounded transition-all
                            ${canComment 
                                ? 'bg-[#068A53] text-white hover:bg-[#057A47]' 
                                : 'bg-gray-400 text-white hover:bg-gray-500'}
                            ${busy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        {busy ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Actualizando...
                            </span>
                        ) : (
                            <span>
                                {canComment ? '✓ Comentarios Habilitados' : '✕ Comentarios Deshabilitados'}
                            </span>
                        )}
                    </button>
                    
                    <span className="text-xs text-gray-500">
                        Click para {canComment ? 'deshabilitar' : 'habilitar'}
                    </span>
                </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={handleCancel}
                disabled={busy}
                className={`px-3 py-1 text-sm font-medium transition border border-gray-300 ${
                busy ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
            >
                Cancelar
            </button>

            <button
                type="button"
                onClick={handleConfirm}
                disabled={busy || !stateId}
                className={`px-3 py-1 text-sm font-medium transition ${
                busy || !stateId ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-white bg-[#1789FC] hover:opacity-90"
                }`}
            >
                {busy ? "Guardando..." : "Guardar"}
            </button>
            </div>
        </div>
        </div>
    );
    }