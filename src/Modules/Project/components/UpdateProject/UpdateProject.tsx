import { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useGetProjectById, useRemoveProjectCoverImage, useUpdateProject, useUploadProjectCoverImage } from "../../Hooks/ProjectHooks";
import { useGetUsersByRoleAdmin } from "../../../Users/Hooks/UsersHooks";
import { useGetAllProjectStates } from "../../../Project_State/Hooks/ProjectStateHooks";
import type { UpdateProject } from "../../Models/Project";
import { UpdateProjectBase, UpdateProjectSchema } from "../../schemas/UpdateProjectSchema";
import ConfirmActionModal from "../../../../Components/Modals/ConfirmActionModal";
import { Button } from "@/Components/ui/button";
import { RichTextEditor } from "@/Components/ui/rich-text-editor";
import { Field, FieldError, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { cn } from "@/lib/utils";
import ProjectCoverField from "../shared/ProjectCoverField";

// helper: Date | string -> "YYYY-MM-DD"
const toYMD = (d?: string | Date) => {
  if (!d) return "";
  const dd = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dd.getTime())) return "";
  return dd.toISOString().split("T")[0];
};

const normalizeDateForApi = (value?: string | Date | null): string | undefined => {
  const normalized = toYMD(value ?? undefined);
  return normalized || undefined;
};

const extractErrorMessages = (error: unknown): string[] => {
  if (!error) return [];
  if (typeof error === "string") return [error];
  if (Array.isArray(error)) return error.flatMap(extractErrorMessages);
  if (typeof error === "object") {
    if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
      return [(error as { message: string }).message];
    }
    if ("errors" in error) {
      return extractErrorMessages((error as { errors?: unknown }).errors);
    }
  }
  return [];
};

const formatErrors = (errors: unknown[]) =>
  errors.flatMap(extractErrorMessages).map((message) => ({ message }));

const shouldShowFieldError = (meta: { isTouched?: boolean; isDirty?: boolean; errors?: unknown[] }) =>
  Boolean(meta.isTouched || meta.isDirty) && Array.isArray(meta.errors) && meta.errors.length > 0;

export default function EditProject() {
  const { projectId } = useParams({ from: "/dashboard/projects/$projectId/edit" });
  const id = Number(projectId);
  const navigate = useNavigate();

  const { project, isPending } = useGetProjectById(id);
  const updateMutation = useUpdateProject();
  const uploadProjectCoverMutation = useUploadProjectCoverImage();
  const removeProjectCoverMutation = useRemoveProjectCoverImage();

  const { projectStates = [], projectStatesLoading } = useGetAllProjectStates();
  const { userAdmin = [], isPending: userAdminLoading } = useGetUsersByRoleAdmin();

  const [showConfirm, setShowConfirm] = useState(false);

  type EditProjectFormValues = UpdateProject & {
    coverImage: File | null;
    removeCoverImage: boolean;
  };

  const defaultValues = useMemo<EditProjectFormValues | undefined>(() => {
    if (!project) return undefined;
    return {
      Name: project.Name ?? "",
      Location: project.Location ?? "",
      InnitialDate: project.InnitialDate ? new Date(project.InnitialDate) : undefined,
      EndDate: project.EndDate ? new Date(project.EndDate) : undefined,
      Objective: project.Objective ?? "",
      Description: project.Description ?? "",
      Observation: project.Observation ?? "",
      ProjectStateId: project.ProjectState?.Id ?? undefined, 
      UserId: project.User?.Id ?? undefined,                  
      IsActive: project.IsActive,                             
      coverImage: null,
      removeCoverImage: false,
    };
  }, [project]);

  const form = useForm({
    validators: {
      onChange: UpdateProjectSchema as any,
      onSubmit: UpdateProjectSchema as any,
    },
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        const fullPayload = {
          Name: value.Name?.trim() || undefined,
          Location: value.Location?.trim() || undefined,
          InnitialDate: normalizeDateForApi(value.InnitialDate),
          EndDate: normalizeDateForApi(value.EndDate),
          Objective: value.Objective?.trim() || undefined,
          Description: value.Description?.trim() || undefined,
          Observation: value.Observation?.trim() || undefined,
          ProjectStateId: value.ProjectStateId ? Number(value.ProjectStateId) : undefined,
          UserId: value.UserId ? Number(value.UserId) : undefined,
        };

        await updateMutation.mutateAsync({ id, data: fullPayload as any });

        if (value.coverImage) {
          await uploadProjectCoverMutation.mutateAsync({
            id,
            file: value.coverImage,
          });
        } else if (value.removeCoverImage && project?.CoverImageUrl) {
          await removeProjectCoverMutation.mutateAsync({ id });
        }

        toast.success("Proyecto actualizado");
        navigate({
          to: "/dashboard/projects/$projectId",
          params: { projectId: String(id) },
        });
      } catch (e: any) {
        console.error("Update error:", e?.response?.data ?? e);
      }
    },
  });

  if (isPending || !defaultValues) return <div className="p-6">Cargando…</div>;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        key={project?.Id ?? "edit-project"}
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
        className="flex flex-col gap-6"
      >
        {/* Nombre */}
        <form.Field
          name="Name"
          validators={{ onChange: UpdateProjectBase.shape.Name as any }}
        >
          {(field) => {
            const isInvalid = shouldShowFieldError(field.state.meta);
            return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                className={cn(isInvalid && "border-destructive focus-visible:ring-destructive")}
              />
              {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
            </Field>
          )}}
        </form.Field>

        {/* Dirección */}
        <form.Field
          name="Location"
          validators={{ onChange: UpdateProjectBase.shape.Location as any }}
        >
          {(field) => {
            const isInvalid = shouldShowFieldError(field.state.meta);
            return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Dirección</FieldLabel>
              <Textarea
                id={field.name}
                rows={3}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                className={cn(isInvalid && "border-destructive focus-visible:ring-destructive")}
              />
              {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
            </Field>
          )}}
        </form.Field>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="InnitialDate"
            validators={{ onChange: UpdateProjectBase.shape.InnitialDate as any }}
          >
            {(field) => {
              const isInvalid = shouldShowFieldError(field.state.meta);
              return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Fecha inicio</FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value ? toYMD(field.state.value as any) : ""}
                  onChange={(e) => field.handleChange(new Date(e.target.value))}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  className={cn(isInvalid && "border-destructive focus-visible:ring-destructive")}
                />
                {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
              </Field>
            )}}
          </form.Field>

          <form.Field
            name="EndDate"
            validators={{ onChange: UpdateProjectBase.shape.EndDate as any }}
          >
            {(field) => {
              const isInvalid = shouldShowFieldError(field.state.meta);
              return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Fecha fin</FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value ? toYMD(field.state.value as any) : ""}
                  onChange={(e) => field.handleChange(new Date(e.target.value))}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  className={cn(isInvalid && "border-destructive focus-visible:ring-destructive")}
                />
                {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
              </Field>
            )}}
          </form.Field>
        </div>

        <form.Field name="coverImage">
          {(coverField) => (
            <form.Field name="removeCoverImage">
              {(removeCoverField) => (
                <ProjectCoverField
                  file={coverField.state.value}
                  existingUrl={project?.CoverImageUrl}
                  markForRemoval={removeCoverField.state.value}
                  onFileChange={coverField.handleChange}
                  onMarkForRemovalChange={removeCoverField.handleChange}
                />
              )}
            </form.Field>
          )}
        </form.Field>

        {/* Objetivo */}
        <form.Field
          name="Objective"
          validators={{ onChange: UpdateProjectBase.shape.Objective as any }}
        >
          {(field) => {
            const isInvalid = shouldShowFieldError(field.state.meta);
            return (
            <Field data-invalid={isInvalid}>
              <FieldLabel>Objetivo</FieldLabel>
              <RichTextEditor
                value={field.state.value ?? ""}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Objetivo principal del proyecto…"
                minHeight="7rem"
                className={cn(isInvalid && "border-destructive focus-within:ring-destructive")}
              />
              {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
            </Field>
          )}}
        </form.Field>

        {/* Descripción */}
        <form.Field
          name="Description"
          validators={{ onChange: UpdateProjectBase.shape.Description as any }}
        >
          {(field) => {
            const isInvalid = shouldShowFieldError(field.state.meta);
            return (
            <Field data-invalid={isInvalid}>
              <FieldLabel>Descripción</FieldLabel>
              <RichTextEditor
                value={field.state.value ?? ""}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Descripción detallada del proyecto…"
                minHeight="9rem"
                className={cn(isInvalid && "border-destructive focus-within:ring-destructive")}
              />
              {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
            </Field>
          )}}
        </form.Field>

        {/* Observación */}
        <form.Field
          name="Observation"
          validators={{ onChange: UpdateProjectBase.shape.Observation as any }}
        >
          {(field) => {
            const isInvalid = shouldShowFieldError(field.state.meta);
            return (
            <Field data-invalid={isInvalid}>
              <FieldLabel>Observaciones</FieldLabel>
              <RichTextEditor
                value={field.state.value ?? ""}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Observaciones adicionales…"
                minHeight="6rem"
                className={cn(isInvalid && "border-destructive focus-within:ring-destructive")}
              />
              {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
            </Field>
          )}}
        </form.Field>

        {/* Estado */}
        <form.Field
          name="ProjectStateId"
          validators={{ onChange: UpdateProjectBase.shape.ProjectStateId as any }}
        >
          {(field) => {
            const isInvalid = shouldShowFieldError(field.state.meta);
            return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
              <select
                id={field.name}
                className={cn(
                  "px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition",
                  isInvalid && "border-destructive text-destructive focus:border-destructive",
                )}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                disabled={projectStatesLoading}
                aria-invalid={isInvalid}
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
              {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
            </Field>
          )}}
        </form.Field>

        {/* Encargado (solo UI). NO se envía en PUT actual */}
        <form.Field
          name="UserId"
          validators={{ onChange: UpdateProjectBase.shape.UserId as any }}
        >
          {(field) => {
            const isInvalid = shouldShowFieldError(field.state.meta);
            return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Encargado</FieldLabel>
              <select
                id={field.name}
                className={cn(
                  "px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition rounded",
                  isInvalid && "border-destructive text-destructive focus:border-destructive",
                )}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                disabled={userAdminLoading}
                aria-invalid={isInvalid}
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
              {isInvalid ? <FieldError errors={formatErrors(field.state.meta.errors)} /> : null}
            </Field>
          )}}
        </form.Field>

        {/* Acciones */}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="mt-2 flex justify-between pb-4">
              <Button
                type="submit"
                className="bg-[#091540] text-white hover:bg-[#0b1b56]"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Actualizando..." : "Guardar cambios"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {navigate({ to: "/dashboard/projects" }); toast.warning("Edición cancelada");}}
              >
                Cancelar
              </Button>
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
