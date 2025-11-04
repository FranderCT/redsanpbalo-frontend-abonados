import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateReportByAdmin } from "../../Hooks/ReportsHooks";
import { useGetAllReportStates } from "../../Hooks/ReportStatesHooks";
import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { useGetUsersByRoleFontanero } from "../../../Users/Hooks/UsersHooks";
import { CreateReportSchema } from "../../schemas/ReportSchema";

export default function CreateReportModal() {
  const [open, setOpen] = useState(false);
  const createReportMutation = useCreateReportByAdmin();

  // Hooks para obtener datos
  const { reportStates = [], isLoading: statesLoading } = useGetAllReportStates();
  const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations = [], isLoading: locationsLoading } = useGetAllReportLocations();
  const { UserProfile, isLoading: profileLoading } = useGetUserProfile();
  const { fontaneros = [], isPending: fontanerosLoading } = useGetUsersByRoleFontanero();

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
      ReportStateId: 0,
      UserInChargeId: 0,
    },
    validators: {
      onChange: CreateReportSchema,
    },
    onSubmit: async ({ value }) => {
      if (!UserProfile?.Id) {
        toast.error("No se pudo obtener la información del usuario");
        return;
      }

      const payload = {
        Location: value.Location,
        Description: value.Description,
        UserId: UserProfile.Id,
        LocationId: Number(value.LocationId),
        ReportTypeId: Number(value.ReportTypeId),
        ReportStateId: Number(value.ReportStateId),
        UserInChargeId: Number(value.UserInChargeId) || undefined,
      };

      try {
        await createReportMutation.mutateAsync(payload);
        toast.success("¡Reporte creado exitosamente!");
        form.reset();
        setOpen(false);
      } catch (error) {
        toast.error("Error al crear el reporte");
        console.error(error);
      }
    },
  });

  const isLoading = statesLoading || typesLoading || locationsLoading || profileLoading;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Crear reporte
      </button>

      <ModalBase open={open} onClose={handleClose} panelClassName="w-[min(90vw,700px)] p-4 flex flex-col max-h-[90vh]">
      <div className="flex-shrink-0 flex flex-col">
        <h2 className="text-2xl text-[#091540] font-bold">Crear Nuevo Reporte</h2>
        <span className="text-md">Complete la información del reporte</span>
      </div>

      <div className="p-6 bg-white overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando información...</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 "
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
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                        </p>
                    )}
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
                      className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#091540] focus:border-transparent"
                      placeholder="Describe detalladamente el problema..."
                      rows={3}
                      required
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                        </p>
                    )}
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
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                        </p>
                    )}
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
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                        </p>
                    )}
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
                      Fontanero Encargado (Opcional)
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
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                        </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Información del usuario que crea */}
            {UserProfile && (
              <div className="bg-gray-50 p-3 border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Reporte creado por:</strong> {UserProfile.Name} {UserProfile.Surname1}
                </p>
                <p className="text-xs text-gray-500">{UserProfile.Email}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#091540] text-white hover:bg-[#091540]/90 transition-colors disabled:opacity-50"
                disabled={createReportMutation.isPending}
              >
                {createReportMutation.isPending ? "Creando..." : "Crear Reporte"}
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