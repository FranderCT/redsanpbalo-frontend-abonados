    import { useForm } from "@tanstack/react-form";
    import { toast } from "react-toastify";
    import { ModalBase } from "../../../../Components/Modals/ModalBase";
    import { useUpdateReport } from "../../Hooks/ReportsHooks";
    import { useGetAllReportStates } from "../../Hooks/ReportStatesHooks";
    import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
    import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
    import { useGetUsersByRoleFontanero } from "../../../Users/Hooks/UsersHooks";
    import type { Report } from "../../Models/Report";

    interface EditReportModalProps {
    report: Report;
    open: boolean;
    onClose: () => void;
    }

export default function EditReportModal({ report, open, onClose }: EditReportModalProps) {
    const updateReportMutation = useUpdateReport();

    // Hooks para obtener datos
    const { reportStates = [], isLoading: statesLoading } = useGetAllReportStates();
    const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
    const { reportLocations = [], isLoading: locationsLoading } = useGetAllReportLocations();
    const { fontaneros = [], isPending: fontanerosLoading } = useGetUsersByRoleFontanero();

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const form = useForm({
        defaultValues: {
        Location: report.Location || "",
        Description: report.Description || "",
        LocationId: report.ReportLocation?.Id || 0,
        ReportTypeId: report.ReportType?.Id || 0,
        ReportStateId: report.ReportState?.IdReportState || 0,
        UserInChargeId: report.UserInCharge?.Id || 0,
        AdditionalInfo: report.AdditionalInfo || "",
        },
        onSubmit: async ({ value }) => {
        const payload = {
            Location: value.Location,
            Description: value.Description,
            LocationId: Number(value.LocationId) || undefined,
            ReportTypeId: Number(value.ReportTypeId) || undefined,
            ReportStateId: Number(value.ReportStateId) || undefined,
            UserInChargeId: Number(value.UserInChargeId) || undefined,
            AdditionalInfo: value.AdditionalInfo || undefined,
        };

        try {
            await updateReportMutation.mutateAsync({
            reportId: report.Id.toString(),
            payload,
            });
            toast.success("¡Reporte actualizado exitosamente!");
            form.reset();
            onClose();
        } catch (error) {
            toast.error("Error al actualizar el reporte");
            console.error(error);
        }
        },
    });

    const isLoading = statesLoading || typesLoading || locationsLoading || fontanerosLoading;

return (
        <ModalBase open={open} onClose={handleClose} panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-gray-200 bg-white flex-shrink-0">
            <h3 className="text-xl font-bold text-[#091540]">Editar Reporte #{report.Id}</h3>
            <span className="text-gray-600">Modifica la información del reporte</span>
        </div>

        <div className="p-6 bg-white overflow-y-auto flex-1">
            {isLoading ? (
            <p className="text-center text-gray-500">Cargando información...</p>
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
                        Ubicación *
                        </label>
                        <input
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                        placeholder="Ej: Calle principal, casa #123"
                        required
                        />
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
                        Descripción *
                        </label>
                        <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent resize-none"
                        placeholder="Describe detalladamente el problema..."
                        required
                        />
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
                        <option value={0}>Seleccionar barrio</option>
                        {reportLocations.map((location) => (
                            <option key={location.Id} value={location.Id}>
                            {location.Neighborhood}
                            </option>
                        ))}
                        </select>
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
                        Tipo de Reporte *
                        </label>
                        <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                        required
                        >
                        <option value={0}>Seleccionar tipo</option>
                        {reportTypes.map((type) => (
                            <option key={type.Id} value={type.Id}>
                            {type.Name}
                            </option>
                        ))}
                        </select>
                    </div>
                    )}
                </form.Field>
                </div>

                {/* Estado del Reporte */}
                <div>
                <form.Field name="ReportStateId">
                    {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-[#091540] mb-1">
                        Estado *
                        </label>
                        <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                        required
                        >
                        <option value={0}>Seleccionar estado</option>
                        {reportStates.map((state) => (
                            <option key={state.IdReportState} value={state.IdReportState}>
                            {state.Name}
                            </option>
                        ))}
                        </select>
                    </div>
                    )}
                </form.Field>
                </div>

                {/* Usuario Encargado (Fontanero) */}
                <div>
                <form.Field name="UserInChargeId">
                    {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-[#091540] mb-1">
                        Fontanero Encargado
                        </label>
                        <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                        disabled={fontanerosLoading}
                        >
                        <option value={0}>
                            {fontanerosLoading ? "Cargando fontaneros..." : "Sin asignar"}
                        </option>
                        {fontaneros.map((fontanero) => (
                            <option key={fontanero.Id} value={fontanero.Id}>
                            {fontanero.Name} {fontanero.Surname1}
                            </option>
                        ))}
                        </select>
                    </div>
                    )}
                </form.Field>
                </div>

                {/* Información adicional */}
                <div>
                <form.Field name="AdditionalInfo">
                    {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-[#091540] mb-1">
                        Información adicional
                        </label>
                        <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent resize-none"
                        placeholder="Información adicional sobre el reporte..."
                        rows={2}
                        />
                    </div>
                    )}
                </form.Field>
                </div>

                {/* Información del reporte original */}
                <div className="bg-gray-50 p-3 border border-gray-200 rounded">
                <p className="text-sm text-gray-600">
                    <strong>Reportado por:</strong> {report.User.Name} {report.User.Surname1}
                </p>
                <p className="text-xs text-gray-500">{report.User.Email}</p>
                <p className="text-xs text-gray-500 mt-1">
                    <strong>Fecha de creación:</strong>{" "}
                    {new Date(report.CreatedAt).toLocaleString()}
                </p>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#091540] text-white hover:bg-[#091540]/90 transition-colors disabled:opacity-50"
                    disabled={updateReportMutation.isPending}
                >
                    {updateReportMutation.isPending ? "Actualizando..." : "Actualizar Reporte"}
                </button>
                
                <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                    disabled={updateReportMutation.isPending}
                >
                    Cancelar
                </button>
                </div>
            </form>
            )}
        </div>
        </ModalBase>
    );
    }