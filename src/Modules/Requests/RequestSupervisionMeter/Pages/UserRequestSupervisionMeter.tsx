import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { useCreateSupervisionMeterRequest } from "../../../Request-Abonados/Hooks/Supervision-Meter/SupervionMeterHooks";
import { toast } from "react-toastify";
import ListReqSupervisionMeterUser from "../../../Request-Abonados/Pages/SupervisionMeter/ListReqSupervisionMeterUser";

export default function UserRequestSupervisionMeter() {
    const [viewMode, setViewMode] = useState<'create' | 'list'>('create');
    const useCreateSupervisionMeterRequestMutation = useCreateSupervisionMeterRequest();
    const { UserProfile } = useGetUserProfile();

    const handleClose = () => {
        toast.warning("Solicitud cancelada", { position: "top-right", autoClose: 3000 });
        form.reset();
    };

    const form = useForm({
        defaultValues: {
            Location: '',
            // NIS se determinará por efecto según cantidad en el perfil
            NIS: 0,
            Justification: '',
            UserId: UserProfile?.Id || 0
        },
        onSubmit: async ({ value, formApi }) => {
            try {
                await useCreateSupervisionMeterRequestMutation.mutateAsync(value);
                formApi.reset();
            } catch (error) {
                console.error("Error al crear la solicitud de supervisión de medidor", error);
            }
        }
    });

    // Efecto para inicializar NIS cuando el perfil se carga
    useEffect(() => {
        const nisArray = (UserProfile as any)?.Nis as number[] | undefined;
        if (Array.isArray(nisArray)) {
            if (nisArray.length === 1) {
                // Solo asignar si aún está en 0
                if (form.state.values.NIS === 0) {
                    form.setFieldValue('NIS', nisArray[0]);
                }
            } else if (nisArray.length === 0) {
                // mantener 0
            } else {
                // múltiples: asegurar que se requiera selección manual => mantener 0
            }
        }
    }, [UserProfile, form.state.values.NIS]);

    return (
        <div>
            {/* Header */}
            <div className="px-6 py-4 text-[#091540] border-b border-gray-200 flex items-center justify-between gap-4 bg-white">
                <div className="hidden sm:block">
                    <h3 className="text-lg font-semibold">Supervisión de medidor</h3>
                    <p className="text-xs text-[#091540]/70">Cree una nueva solicitud o revise su historial</p>
                </div>

                <div className="inline-flex items-center  bg-gray-100 p-1 border border-gray-200 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setViewMode('create')}
                        aria-pressed={viewMode === 'create'}
                        className={`h-9 px-4 text-sm font-medium transition-all ${viewMode === 'create' ? 'bg-[#091540] text-white shadow' : 'bg-transparent text-[#091540] hover:bg-white'}`}
                    >
                        Nueva solicitud
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        aria-pressed={viewMode === 'list'}
                        className={`h-9 px-4 text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-[#091540] text-white shadow' : 'bg-transparent text-[#091540] hover:bg-white'}`}
                    >
                        Ver mis solicitudes
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Body */}
            {viewMode === 'list' ? (
                <ListReqSupervisionMeterUser />
            ) : (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="px-6 py-4 space-y-6"
            >
                {/* Título y descripción */}
                <h1 className="text-2xl font-bold text-[#091540]">Solicitud de supervisión de medidor</h1>
                <p className="text-[#091540]/70 text-md">Complete los datos para generar la solicitud</p>
                <div className="border-b border-dashed border-gray-300 mb-2"></div>

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

                {/* Ubicación */}
                <form.Field name="Location">
                    {(field) => (
                        <label className="grid gap-2">
                            <span className="text-sm font-medium text-gray-700">
                                Ubicación del medidor <span className="text-red-500">*</span>
                            </span>
                            <textarea
                                autoFocus
                                className="w-full min-h-[80px] px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition shadow-sm"
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

                {/* NIS dinámico según cantidad disponible en el perfil */}
                <form.Subscribe selector={(s) => s.values.NIS}>
                    {() => {
                        const nisArray = (UserProfile as any)?.Nis as number[] | undefined;
                        const hasArray = Array.isArray(nisArray);
                        if (!hasArray) {
                            // Perfil aún no cargado
                            return (
                                <label className="grid gap-2">
                                    <span className="text-sm font-medium text-gray-700">NIS</span>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-md"
                                        value="Cargando perfil..."
                                        readOnly
                                        disabled
                                    />
                                </label>
                            );
                        }
                        if (nisArray.length === 0) {
                            return (
                                <label className="grid gap-2">
                                    <span className="text-sm font-medium text-gray-700">NIS</span>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-md"
                                        value="No tiene NIS registrado"
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
                            <form.Field name="NIS">
                                {(field) => (
                                    <label className="grid gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Seleccione NIS <span className="text-red-500">*</span>
                                        </span>
                                        <select
                                            className="w-full px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition shadow-sm rounded-md"
                                            value={field.state.value || 0}
                                            onChange={(e) => field.handleChange(Number(e.target.value))}
                                            required
                                        >
                                            <option value={0} disabled>Seleccione una opción</option>
                                            {nisArray.map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                                            </p>
                                        )}
                                    </label>
                                )}
                            </form.Field>
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
                                className="w-full min-h-[100px] px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition shadow-sm"
                                placeholder="Describa el motivo de la solicitud de supervisión del medidor..."
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
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition font-medium flex items-center justify-center gap-2"
                                disabled={!canSubmit || isSubmitting}
                            >
                                {isSubmitting && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {isSubmitting ? "Creando solicitud..." : "Crear Solicitud"}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="h-10 px-6 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </form.Subscribe>
            </form>
            )}
        </div>
    );
}
