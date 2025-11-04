import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateReportByUser } from "../../Hooks/ReportsHooks";
import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { CreateReportUserSchema } from "../../schemas/ReportSchema";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function CreateReportUserModal({ open, setOpen }: Props) {

    const createReportMutation = useCreateReportByUser();

    // Hooks para obtener datos
    const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
    const { reportLocations = [], isLoading: locationsLoading } = useGetAllReportLocations();
    const { UserProfile, isLoading: profileLoading } = useGetUserProfile();

    const handleClose = () => {
        setOpen(false);
        form.reset();
    };

    const form = useForm({
        defaultValues: {
        Location: "",
        Description: "",
        LocationId: 0,
        ReportTypeId: 0,
        },
        validators: {
            onChange: CreateReportUserSchema,
        },
        onSubmit: async ({ value }) => {
        if (!UserProfile?.Id) {
            toast.error("Debes estar logueado para crear un reporte");
            return;
        }

        const payload = {
            Location: value.Location,
            Description: value.Description,
            UserId: UserProfile.Id,
            LocationId: Number(value.LocationId),
            ReportTypeId: Number(value.ReportTypeId),
            // Los reportes de usuario siempre empiezan en estado "Pendiente" (ID: 1)
            ReportStateId: 1,
            // Sin usuario a cargo al crear
            UserInChargeId: undefined,
        };

        try {
            await createReportMutation.mutateAsync(payload);
            toast.success("¡Reporte creado exitosamente! Será revisado por nuestro equipo.");
            form.reset();
            setOpen(false);
        } catch (error) {
            toast.error("Error al crear el reporte");
            console.error(error);
        }
        },
    });

    const isLoading = typesLoading || locationsLoading || profileLoading;

return (
    <>
        <ModalBase open={open} onClose={handleClose} panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200 bg-white">
            <h3 className="text-xl font-bold text-[#091540]">Crear Nuevo Reporte</h3>
            <span className="text-gray-600">Reporta un problema en tu zona</span>
            </div>

            <div className="p-6 bg-white">
            {isLoading ? (
                <p className="text-center text-gray-500">Cargando información...</p>
            ) : !UserProfile?.Id ? (
                <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-gray-600">Debes estar logueado para crear un reporte</p>
                </div>
            ) : (
                <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
                >
                {/* Ubicación */}
                <div>
                    <form.Field name="Location">
                    {(field) => (
                        <div>
                        <label className="block text-sm font-medium text-[#091540] mb-1">
                            Ubicación específica *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                            placeholder="Ej: Calle principal, casa #123, frente al parque"
                            required
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Proporciona la dirección exacta donde está el problema
                        </p>
                        </div>
                    )}
                    </form.Field>
                </div>

                {/* Descripción */}
                <div>
                    <form.Field name="Description">
                    {(field) => (
                        <div>
                        <label className="block text-sm font-medium text-[#091540] mb-1">
                            Descripción del problema *
                        </label>
                        <textarea
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                            placeholder="Describe detalladamente el problema que encontraste..."
                            rows={4}
                            required
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Incluye todos los detalles posibles para ayudarnos a resolver el problema
                        </p>
                        </div>
                    )}
                    </form.Field>
                </div>

              {/* Barrio */}
                <div>
                    <form.Field name="LocationId">
                    {(field) => (
                        <div>
                        <label className="block text-sm font-medium text-[#091540] mb-1">
                            Barrio *
                        </label>
                        <select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                            required
                        >
                            <option value={0}>Selecciona tu barrio</option>
                            {reportLocations.map((location) => (
                            <option key={location.Id} value={location.Id}>
                                {location.Neighborhood}
                            </option>
                            ))}
                        </select>
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                            </p>
                        )}
                        </div>
                    )}
                    </form.Field>
                </div>

              {/* Tipo de Reporte */}
                <div>
                    <form.Field name="ReportTypeId">
                    {(field) => (
                        <div>
                        <label className="block text-sm font-medium text-[#091540] mb-1">
                            Tipo de reporte
                        </label>
                        <select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                            required
                        >
                            <option value={0}>Seleccione tipo de reporte</option>
                            {reportTypes.map((type) => (
                            <option key={type.Id} value={type.Id}>
                                {type.Name}
                            </option>
                            ))}
                        </select>
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                            </p>
                        )}
                        </div>
                    )}
                    </form.Field>
                </div>

                {/* Información del usuario */}
                {UserProfile && (
                    <div className="bg-blue-50 p-4 border border-blue-200 rounded">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        </div>
                        <div>
                        <p className="text-sm font-medium text-blue-900">
                            Tu reporte será enviado como: {UserProfile.Name} {UserProfile.Surname1}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">{UserProfile.Email}</p>
                        </div>
                    </div>
                    </div>
                )}

              {/* Botones */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                    type="submit"
                    className="px-4 py-2 bg-[#091540] text-white hover:bg-[#091540]/90 transition-colors disabled:opacity-50"
                    disabled={createReportMutation.isPending || !UserProfile?.Id}
                    >
                        {createReportMutation.isPending ? "Enviando reporte..." : "Enviar reporte"}
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                        disabled={createReportMutation.isPending}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
            )}
        </div>
    </ModalBase>
    </>
);
}