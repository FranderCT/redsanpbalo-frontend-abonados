    // CreateRequestSupervisionMeter2.tsx
    import { useEffect, useState } from "react";
    import { useForm } from "@tanstack/react-form";
    import { toast } from "react-toastify";
    import type { AbonadoSearch } from "../../GeneralGetUser/Model";
    import { useSearchAbonados } from "../../GeneralGetUser/GenralHook";
    import { useCreateSupervisionMeterRequest } from "../../../Request-Abonados/Hooks/Supervision-Meter/SupervionMeterHooks";
    import { ModalBase } from "../../../../Components/Modals/ModalBase";


    /** ============ Helper debounce ============ */
    const useDebouncedValue = (val: string, delay = 400) => {
    const [debounced, setDebounced] = useState(val);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(val), delay);
        return () => clearTimeout(id);
    }, [val, delay]);
    return debounced;
    };

    /** ============ Typeahead (igual al 1er modal) ============ */
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
            value={selectedUser ? `${selectedUser.IDcard ?? (Array.isArray(selectedUser.Nis) && selectedUser.Nis.length ? selectedUser.Nis.join(", ") : "")}` : input}
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
                const idShown = u.IDcard || (Array.isArray(u.Nis) && u.Nis.length ? u.Nis.join(", ") : "");
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
                        {Array.isArray(u.Nis) && u.Nis.length ? ` • NIS: ${u.Nis.join(", ")}` : ""}
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
    const CreateRequestSupervisionMeter2 = () => {
    const createMutation = useCreateSupervisionMeterRequest();
    const [open, setOpen] = useState(false);

    const form = useForm({
        defaultValues: {
        UserId: 0,
        Location: "",
        NIS: 0, // seguimos en estado, pero SOLO lectura en UI
        Justification: "",
        _selectedUser: null as AbonadoSearch | null,
        },
        onSubmit: async ({ value, formApi }) => {
        try {
            if (!value.UserId || value.UserId <= 0) {
            toast.error("Seleccione un abonado válido.");
            return;
            }
            if (!value.Location.trim() || !value.Justification.trim()) {
            toast.error("Complete todos los campos requeridos.");
            return;
            }
            if (!value.NIS || Number(value.NIS) <= 0) {
            toast.error("El abonado no tiene NIS válido.");
            return;
            }

            await createMutation.mutateAsync({
            UserId: value.UserId,
            Location: value.Location.trim(),
            NIS: Number(value.NIS), // tomado del abonado
            Justification: value.Justification.trim(),
            });

            toast.success("Solicitud creada correctamente");
            formApi.reset();
            setOpen(false);
        } catch (error) {
            console.error("Error al crear la solicitud de supervisión de medidor", error);
            toast.error("No se pudo crear la solicitud.");
        }
        },
    });

    const handleClose = () => {
        toast.warning("Solicitud cancelada", { position: "top-right", autoClose: 3000 });
        form.reset();
        setOpen(false);
    };

    return (
        <div>
        <button
            onClick={() => setOpen(true)}
            className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
        >
            + Solicitar Supervisión de Medidor
        </button>

        <ModalBase
            open={open}
            onClose={handleClose}
            panelClassName="w-full max-w-lg !p-0 overflow-hidden shadow-2xl"
        >
            {/* Header */}
            <div className="px-6 py-4 text-[#091540]">
            <h3 className="text-xl font-semibold">Solicitud de Supervisión de Medidor</h3>
            <p className="text-sm opacity-80">Complete los datos para generar la solicitud</p>
            </div>

            <div className="border-t border-gray-100" />

            <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="px-7 py-4 flex flex-col gap-4"
            >
            {/* Abonado */}
            <form.Field name="UserId">
                {(field) => (
                <UserTypeahead
                    value={field.state.value}
                    onChange={(userId, picked) => {
                    field.handleChange(userId);
                    form.setFieldValue("_selectedUser", picked ?? null);
                    // NIS: si el abonado tiene múltiples, forzar selección manual
                    if (picked && Array.isArray(picked.Nis)) {
                        if (picked.Nis.length === 1) {
                        form.setFieldValue("NIS", Number(picked.Nis[0]) || 0);
                        } else {
                        form.setFieldValue("NIS", 0);
                        }
                    } else {
                        const nisNum = (picked as any)?.Nis ? Number((picked as any).Nis) : 0;
                        form.setFieldValue("NIS", Number.isNaN(nisNum) ? 0 : nisNum);
                    }
                    }}
                />
                )}
            </form.Field>

            {/* Tarjeta de información básica del abonado (como el primer modal) */}
            <form.Subscribe selector={(s) => s.values._selectedUser}>
                {(sel) =>
                sel ? (
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="font-medium text-gray-900">{sel.FullName}</div>
                    <div className="text-gray-600">
                        Cédula: <span className="font-mono">{sel.IDcard ?? "—"}</span>
                        {Array.isArray(sel.Nis) && sel.Nis.length ? (
                        <>
                            {" "}
                            • NIS: <span className="font-mono">{sel.Nis.join(", ")}</span>
                        </>
                        ) : null}
                    </div>
                    {/* Campos opcionales si existen en AbonadoSearch */}
                    {sel.Address ? (
                        <div className="text-gray-600">Dirección: {sel.Address}</div>
                    ) : null}
                    {sel.PhoneNumber ? (
                        <div className="text-gray-600">Teléfono: {sel.PhoneNumber}</div>
                    ) : null}
                    </div>
                ) : null
                }
            </form.Subscribe>

            {/* Ubicación */}
            <form.Field name="Location">
                {(field) => (
                <label className="grid gap-2">
                    <span className="text-sm font-medium text-gray-700">
                    Ubicación del medidor <span className="text-red-500">*</span>
                    </span>
                    <textarea
                    autoFocus
                    className="w-full min-h-[80px] px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                    placeholder="Ej. 200m este de la plaza central, casa color verde..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    required
                    />
                </label>
                )}
            </form.Field>

            {/* NIS: seleccionar cuando hay múltiples; solo lectura si único; deshabilitado si ninguno */}
            <form.Subscribe selector={(s) => ({ sel: s.values._selectedUser, nis: s.values.NIS })}>
                {({ sel, nis }) => {
                const nisArray = sel && Array.isArray((sel as any).Nis) ? (sel as any).Nis as number[] : [];
                if (!sel) {
                    return (
                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-gray-700">NIS</span>
                        <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-md"
                        value="Seleccione un abonado primero"
                        readOnly
                        disabled
                        />
                    </label>
                    );
                }
                if (!nisArray.length) {
                    return (
                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-gray-700">NIS</span>
                        <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-md"
                        value="Este abonado no tiene NIS registrado"
                        readOnly
                        disabled
                        />
                    </label>
                    );
                }
                if (nisArray.length === 1) {
                    return (
                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-gray-700">NIS (solo lectura)</span>
                        <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-md"
                        value={String(nisArray[0])}
                        readOnly
                        disabled
                        />
                    </label>
                    );
                }
                return (
                    <label className="grid gap-2">
                    <span className="text-sm font-medium text-gray-700">Seleccione NIS</span>
                    <select
                        className="w-full px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 rounded-md"
                        value={nis || 0}
                        onChange={(e) => form.setFieldValue("NIS", Number(e.target.value) || 0)}
                        required
                    >
                        <option value={0} disabled>
                        Seleccione una opción
                        </option>
                        {nisArray.map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                        ))}
                    </select>
                    </label>
                );
                }}
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
                    placeholder="Describa el motivo de la solicitud de supervisión del medidor..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    required
                    />
                </label>
                )}
            </form.Field>

            {/* Footer */}
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                    type="submit"
                    className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition font-medium flex items-center justify-center gap-2"
                    disabled={!canSubmit || isSubmitting || createMutation.isPending}
                    >
                    {(isSubmitting || createMutation.isPending) && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmitting || createMutation.isPending ? "Creando solicitud..." : "Crear Solicitud"}
                    </button>
                    <button
                    type="button"
                    onClick={handleClose}
                    className="h-10 px-6 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                    disabled={isSubmitting || createMutation.isPending}
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

    export default CreateRequestSupervisionMeter2;
