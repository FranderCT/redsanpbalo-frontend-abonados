    import { useEffect, useState } from "react";
    import { toast } from "react-toastify";
    import type { ReqAvailWater } from "../Models/ReqAvailWater";
    import { useGetAllRequestStates, useUpdateAvailabilityWater } from "../Hooks/ReqAvailWaterHooks";


    type Props = {
    open: boolean;
    req: ReqAvailWater | null;
    onClose: () => void;
    onSuccess?: () => void;
    };

    export default function UpdateReqAvailWaterStateModal({
    open,
    req,
    onClose,
    onSuccess,
    }: Props) {
    const { requestStates = [], isPending, error } = useGetAllRequestStates();
    const updateMutation = useUpdateAvailabilityWater();

    // 🔧 Mantener como string para evitar NaN
    const [stateId, setStateId] = useState<string>("");

    useEffect(() => {
        if (!req) return;
        const current = req.StateRequest?.Id;

        setStateId(current ? String(current) : "");
    }, [req]);

    // 🔧 Debug: Ver qué estados se cargaron
    useEffect(() => {
        if (requestStates.length > 0) {
        }
    }, [requestStates]);

    if (!open || !req) return null;

    const busy = updateMutation.isPending;

    const handleCancel = () => {
        toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
        onClose();
    };

    const handleConfirm = async () => {
        if (!stateId || stateId === "") {
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
        } catch (err: any) {
        toast.error(err?.response?.data?.message || "No se pudo actualizar el estado");
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
            <p><span className="text-gray-500">NIS: </span><b>{(req as any).NIS ?? "-"}</b></p>
            <p><span className="text-gray-500">Dirección: </span><b>{(req as any).Location ?? "-"}</b></p>
            </div>

            <label className="mb-1 block text-sm font-medium text-[#091540]">Estado</label>
            {isPending ? (
            <div className="mb-4 rounded border border-gray-200 p-3 text-sm text-gray-600">
                Cargando estados…
            </div>
            ) : error ? (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                No se pudieron cargar los estados: {error.message}
            </div>
            ) : requestStates.length === 0 ? (
            <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
                No hay estados disponibles
            </div>
            ) : (
            <select
                className="mb-4 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[#1789FC]"
                value={stateId}
                onChange={(e) => {
                const newValue = e.target.value;
                setStateId(newValue);
                }}
                disabled={busy}
            >
                <option value="">Seleccione un estado…</option>
                {requestStates.map((s) => {
                const id = s.Id;
                if (!id) {
                    return null;
                }
                return (
                    <option key={id} value={id}>
                    {s.Name}
                    </option>
                );
                })}
            </select>
            )}

            <div className="mt-2 flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={handleCancel}
                disabled={busy}
                className={`px-3 py-1 text-sm font-medium transition border border-gray-300 rounded ${
                busy ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
            >
                Cancelar
            </button>

            <button
                type="button"
                onClick={handleConfirm}
                disabled={busy || !stateId || stateId === ""}
                className={`px-3 py-1 text-sm font-medium transition rounded ${
                busy || !stateId || stateId === ""
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "text-white bg-[#1789FC] hover:opacity-90"
                }`}
            >
                {busy ? "Guardando..." : "Guardar"}
            </button>
            </div>
        </div>
        </div>
    );
    }
