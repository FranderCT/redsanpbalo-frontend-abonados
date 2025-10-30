    import { useEffect, useState } from "react";
    import { useForm } from "@tanstack/react-form";
    import { toast } from "react-toastify";
    import { ModalBase } from "../../../../Components/Modals/ModalBase";
    import { useCreateChangeMeterRequest } from "../../../Request-Abonados/Hooks/Change-Meter/ChangeMeterHooks";
    import type { AbonadoSearch } from "../../GeneralGetUser/Model";
    import { useSearchAbonados } from "../../GeneralGetUser/GenralHook";

    /** =================== Helpers =================== **/
    const useDebouncedValue = (val: string, delay = 400) => {
    const [debounced, setDebounced] = useState(val);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(val), delay);
        return () => clearTimeout(id);
    }, [val, delay]);
    return debounced;
    };

    /** =================== Typeahead (cédula/NIS/nombre) =================== **/
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

    /** =================== Modal =================== **/
    const CreateChangeMeterModal = () => {
    const useCreateChangeMeterRequestMutation = useCreateChangeMeterRequest();
    const [open, setOpen] = useState(false);

    const form = useForm({
        defaultValues: {
        UserId: 0,                 // se escoge por typeahead
        Location: "",
        NIS: 0,                    // solo lectura en UI
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

            await useCreateChangeMeterRequestMutation.mutateAsync({
            UserId: value.UserId,
            Location: value.Location.trim(),
            NIS: Number(value.NIS), // tomado del abonado
            Justification: value.Justification.trim(),
            });

            toast.success("Solicitud creada correctamente");
            formApi.reset();
            setOpen(false);
        } catch (error) {
            console.error("Error al crear la solicitud de cambio de medidor", error);
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
            + Solicitar Cambio de Medidor
        </button>

        <ModalBase
            open={open}
            onClose={handleClose}
            panelClassName="w-full max-w-lg !p-0 overflow-hidden shadow-2xl"
        >
            {/* Header */}
            <div className="px-6 py-5 text-[#091540]">
            <h3 className="text-xl font-semibold">Solicitud de Cambio de Medidor</h3>
            <p className="text-sm opacity-80">Complete los datos para generar la solicitud</p>
            </div>

        

            {/* Body */}
            <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
            {/* Selector de abonado (igual que el primer modal) */}
            <form.Field name="UserId">
                {(field) => (
                <UserTypeahead
                    value={field.state.value}
                    onChange={(userId, picked) => {
                    field.handleChange(userId);
                    form.setFieldValue("_selectedUser", picked ?? null);
                    // Pre-cargar NIS solo desde el abonado
                    const nisNum = picked?.Nis ? Number(picked.Nis) : 0;
                    form.setFieldValue("NIS", Number.isNaN(nisNum) ? 0 : nisNum);
                    }}
                />
                )}
            </form.Field>

            {/* Tarjeta de info básica del abonado */}
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
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                    )}
                </label>
                )}
            </form.Field>

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

            {/* Justificación */}
            <form.Field name="Justification">
                {(field) => (
                <label className="grid gap-2">
                    <span className="text-sm font-medium text-gray-700">
                    Justificación de la solicitud <span className="text-red-500">*</span>
                    </span>
                    <textarea
                    className="w-full min-h-[100px] px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                    placeholder="Describa el motivo del cambio de medidor..."
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

            {/* Footer */}
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                    type="submit"
                    className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition font-medium flex items-center justify-center gap-2"
                    disabled={!canSubmit || isSubmitting || useCreateChangeMeterRequestMutation.isPending}
                    >
                    {(isSubmitting || useCreateChangeMeterRequestMutation.isPending) && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isSubmitting || useCreateChangeMeterRequestMutation.isPending
                        ? "Creando solicitud..."
                        : "Crear Solicitud"}
                    </button>
                    <button
                    type="button"
                    onClick={handleClose}
                    className="h-10 px-6 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                    disabled={isSubmitting || useCreateChangeMeterRequestMutation.isPending}
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

    export default CreateChangeMeterModal;
