import { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useGetProjectById, useUpdateProject } from "../../Hooks/ProjectHooks";
import { useGetUsersByRoleAdmin } from "../../../Users/Hooks/UsersHooks";
import { useGetAllProjectStates } from "../../../Project_State/Hooks/ProjectStateHooks";
import type { UpdateProject } from "../../Models/Project";
import { UpdateProjectSchema } from "../../schemas/UpdateProjectSchema";
import ConfirmActionModal from "../../../../Components/Modals/ConfirmActionModal";

// helper: Date | string -> "YYYY-MM-DD"
const toYMD = (d?: string | Date) => {
  if (!d) return "";
  const dd = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dd.getTime())) return "";
  return dd.toISOString().split("T")[0];
};

export default function EditProject() {
  const { projectId } = useParams({ from: "/dashboard/projects/$projectId/edit" });
  const id = Number(projectId);
  const navigate = useNavigate();

  const { project, isPending } = useGetProjectById(id);
  const updateMutation = useUpdateProject();

  const { projectStates = [], projectStatesLoading } = useGetAllProjectStates();
  const { userAdmin = [], isPending: userAdminLoading } = useGetUsersByRoleAdmin();

  const [showConfirm, setShowConfirm] = useState(false);

  const defaultValues = useMemo<UpdateProject | undefined>(() => {
    if (!project) return undefined;
    return {
      Name: project.Name ?? "",
      Location: project.Location ?? "",
      InnitialDate: project.InnitialDate ? new Date(project.InnitialDate) : undefined,
      EndDate: project.EndDate ? new Date(project.EndDate) : undefined,
      Objective: project.Objective ?? "",
      Description: project.Description ?? "",
      Observation: project.Observation ?? "",
      SpaceOfDocument: project.SpaceOfDocument ?? "",
      ProjectStateId: project.ProjectState?.Id ?? undefined, 
      UserId: project.User?.Id ?? undefined,                  
      IsActive: project.IsActive,                             
    };
  }, [project]);

  const form = useForm({
    validators: {
      onChange: UpdateProjectSchema,
    },
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        const fullPayload = {
          Name: value.Name?.trim() ?? "",
          Location: value.Location?.trim() ?? "",
          InnitialDate: toYMD(value.InnitialDate)!, 
          EndDate: toYMD(value.EndDate)!,          
          Objective: value.Objective?.trim() ?? "",
          Description: value.Description?.trim() ?? "",
          Observation: value.Observation?.trim() ?? "",
          SpaceOfDocument: value.SpaceOfDocument?.trim() ?? "",
          ProjectStateId: String(value.ProjectStateId ?? ""),
          UserId: Number(value.UserId), // ⬅️ como string
        };

        await updateMutation.mutateAsync({ id, data: fullPayload as any });

        toast.success("Proyecto actualizado");
        navigate({
          to: "/dashboard/projects/$projectId",
          params: { projectId: String(id) },
        });
      } catch (e: any) {
        console.error("Update error:", e?.response?.data ?? e);
        toast.error("Error al actualizar el proyecto");
      }
    },
  });

  if (isPending || !defaultValues) return <div className="p-6">Cargando…</div>;

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <form
        key={project?.Id ?? "edit-project"}
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
        className="flex flex-col gap-6"
      >
        {/* Nombre */}
        <form.Field name="Name">
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#091540]">Nombre</span>
              <input
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
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

        {/* Dirección */}
        <form.Field name="Location">
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#091540]">Dirección</span>
              <textarea
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                rows={3}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field name="InnitialDate">
            {(field) => (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[#091540]">Fecha inicio</span>
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  value={field.state.value ? toYMD(field.state.value as any) : ""}
                  onChange={(e) => field.handleChange(new Date(e.target.value))}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                )}
              </label>
            )}
          </form.Field>

          <form.Field name="EndDate">
            {(field) => (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[#091540]">Fecha fin</span>
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                  value={field.state.value ? toYMD(field.state.value as any) : ""}
                  onChange={(e) => field.handleChange(new Date(e.target.value))}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                    {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                    </p>
                )}
              </label>
            )}
          </form.Field>
        </div>

        {/* Objetivo */}
        <form.Field name="Objective">
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#091540]">Objetivo</span>
              <textarea
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                rows={3}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Descripción */}
        <form.Field name="Description">
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#091540]">Descripción</span>
              <textarea
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                rows={3}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Observación */}
        <form.Field name="Observation">
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#091540]">Observaciones</span>
              <textarea
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                rows={3}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Espacio de documento */}
        <form.Field name="SpaceOfDocument">
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#091540]">Espacio de documento</span>
              <input
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Estado */}
        <form.Field name="ProjectStateId">
          {(field) => (
            <label className="grid gap-1">
              <span className="text-sm font-medium text-[#091540]">Estado</span>
              <select
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={projectStatesLoading}
              >
                <option value="" disabled>
                  {projectStatesLoading ? "Cargando estados…" : "Seleccione estado"}
                </option>
                {projectStates.map((s) => (
                  <option key={s.Id} value={s.Id}>
                    {s.Name}
                  </option>
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

        {/* Encargado (solo UI). NO se envía en PUT actual */}
        <form.Field name="UserId">
          {(field) => (
            <label className="grid gap-1">
              <span className="text-sm font-medium text-[#091540]">Encargado</span>
              <select
                className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition rounded"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                disabled={userAdminLoading}
              >
                <option value="" disabled>
                  {userAdminLoading ? "Cargando administradores..." : "Seleccione encargado"}
                </option>
                {userAdmin.map((u) => (
                  <option key={u.Id} value={u.Id}>
                    {u.Name} {u.Surname1} {u.Surname2}
                  </option>
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

        {/* Acciones */}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="flex justify-between mt-8">
              {/* Abrimos modal de confirmación */}
              <button
                type="submit"
                className="px-6 py-2 border border-[#091540] bg-[#091540] text-white disabled:opacity-60"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Actualizando..." : "Guardar cambios"}
              </button>

              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-[#091540]"
                onClick={() => {navigate({ to: "/dashboard/projects" }); toast.warning("Edición cancelada");}}
              >
                Cancelar
              </button>
            </div>
          )}
        </form.Subscribe>
      </form>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirm(false)}
          />
          <ConfirmActionModal
            title="¿Confirmar cambios?"
            description="¿Está seguro de querer actualizar este proyecto?"
            confirmLabel="Confirmar"
            cancelLabel="Cancelar"
            onConfirm={() => form.handleSubmit()} // ⬅️ envía el form
            onCancel={() => {
              setShowConfirm(false);
              toast.warning("Edición cancelada");
              navigate({
                to: "/dashboard/projects/$projectId",
                params: { projectId: String(id) },
              });
            }}
            onClose={() => {setShowConfirm(false); toast.warning("Edición cancelada");}}
          />
        </div>
      )}
    </div>
  );
}
