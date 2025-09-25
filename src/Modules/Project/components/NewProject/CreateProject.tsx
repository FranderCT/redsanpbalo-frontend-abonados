import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { newProjectInitialState } from "../../Models/Project";
import { useCreateProject } from "../../Hooks/ProjectHooks";

import { useGetAllProjectStates } from "../../../Project_State/Hooks/ProjectStateHooks";
import { toast } from "react-toastify";
import type { NewProjectProjection } from "../../Project-projection/Models/ProjectProjection";
import { useCreateProjectProjection } from "../../Project-projection/Hooks/Project-ProjectionHooks";


const steps = [
  { label: "Datos Básicos" },
  { label: "Detalles" },
  { label: "Proyección" },   
  { label: "Confirmación" },
];

const CreateProject = () => {
  const [step, setStep] = useState(0);
  const createProjectMutation = useCreateProject();
  const createProjectProjectionMutation = useCreateProjectProjection();
  const { projectStates, projectStatesLoading } = useGetAllProjectStates();

  const form = useForm({
    defaultValues: {
      ...newProjectInitialState,
      NewProjectProjection: "", 
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        // 1) Crear proyecto
        const projectRes = await createProjectMutation.mutateAsync(value);
        const projectId =
          (projectRes as any)?.Id ??
          (projectRes as any)?.id ??
          (projectRes as any)?.data?.Id ??
          (projectRes as any)?.data?.id;

        if (!projectId) throw new Error("No se obtuvo el Id del proyecto creado.");

        // 2) Crear proyección (usando tus interfaces)
        const projectionPayload: NewProjectProjection = {
          ProjectId: Number(projectId),
          Observation: value.Observation ?? "",
        };

        await createProjectProjectionMutation.mutateAsync(projectionPayload);

        // 3) Éxito
        formApi.reset();
        toast.success("¡Proyecto y proyección creados exitosamente!", {
          position: "top-right",
          autoClose: 3000,
        });
        setStep(0);
      } catch (err) {
        console.error("Error al crear proyecto/proyección", err);
        toast.error("¡Error al crear el proyecto o su proyección!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const renderStepFields = () => {
    switch (step) {
      // Paso 0: Datos Básicos
      case 0:
        return (
          <div className="flex flex-col gap-6" key="step-0">
            <form.Field name="Name">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Nombre del proyecto</span>
                  <input
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                    placeholder="Ej. Instalación de nuevas tuberías…"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="Location">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Dirección</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Ej. 200m este de la plaza…"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    required
                  />
                </label>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field name="InnitialDate">
                {(field) => (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#091540]">Fecha de inicio</span>
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                      value={field.state.value ? new Date(field.state.value).toISOString().split("T")[0] : ""}
                      onChange={(e) => field.handleChange(new Date(e.target.value))}
                      required
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="EndDate">
                {(field) => (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#091540]">Fecha de fin</span>
                    <input
                      type="date"
                      className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                      value={field.state.value ? new Date(field.state.value).toISOString().split("T")[0] : ""}
                      onChange={(e) => field.handleChange(new Date(e.target.value))}
                      required
                    />
                  </label>
                )}
              </form.Field>
            </div>
          </div>
        );

      // Paso 1: Detalles
      case 1:
        return (
          <div className="flex flex-col gap-6" key="step-1">
            <form.Field name="Objective">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Objetivo del proyecto</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Objetivo"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    required
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="Description">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Descripción</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Descripción del proyecto"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    required
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="Observation">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Observaciones del proyecto</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Observaciones del proyecto (opcional)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="SpaceOfDocument">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Espacio de documento</span>
                  <input
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                    placeholder="URL / carpeta / código"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="ProjectStateId">
              {(field) => (
                <label className="grid gap-1">
                  <select
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    disabled={projectStatesLoading}
                  >
                    <option value={0} disabled>
                      {projectStatesLoading ? "Cargando estados…" : "Seleccione estado"}
                    </option>
                    {projectStates.map((s) => (
                      <option key={s.Id} value={s.Id}>
                        {s.Name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </form.Field>
          </div>
        );

      
      case 2:
        return (
          <div className="flex flex-col gap-6" key="step-2">
            <form.Field name="Observation">
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#091540]">Observación de la proyección</span>
                  <textarea
                    className="px-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Notas u observaciones para la proyección del proyecto"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                  />
                </label>
              )}
            </form.Field>
          </div>
        );

      // Paso 3: Confirmación
      case 3:
        return (
          <div className="text-[#091540] space-y-2 px-2" key="step-3">
            <h3 className="text-lg font-semibold mb-2">Confirma los datos:</h3>
            <form.Subscribe selector={(state) => state.values}>
              {(values) => (
                <ul className="text-base space-y-1">
                  <li><b>Nombre:</b> {values.Name}</li>
                  <li><b>Ubicación:</b> {values.Location}</li>
                  <li><b>Fecha inicio:</b> {values.InnitialDate ? new Date(values.InnitialDate).toLocaleDateString() : ""}</li>
                  <li><b>Fecha fin:</b> {values.EndDate ? new Date(values.EndDate).toLocaleDateString() : ""}</li>
                  <li><b>Objetivo:</b> {values.Objective}</li>
                  <li><b>Descripción:</b> {values.Description}</li>
                  <li><b>Obs. Proyecto:</b> {values.Observation}</li>
                  <li><b>Espacio doc.:</b> {values.SpaceOfDocument}</li>
                  <li><b>Obs. Proyección:</b> {values.Observation}</li>
                </ul>
              )}
            </form.Subscribe>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-2 text-[#091540] text-center tracking-tight">
        {steps[step].label}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < steps.length - 1) {
            setStep(step + 1);
          } else {
            form.handleSubmit();
          }
        }}
        className="flex flex-col gap-6"
      >
        {renderStepFields()}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-[#091540] hover:border-blue-400 hover:text-blue-700 transition"
                  onClick={() => setStep(step - 1)}
                >
                  Atrás
                </button>
              ) : (
                <div />
              )}
              <button
                type="submit"
                className="px-6 py-2 border border-[#091540] bg-[#091540] text-white hover:text-[#f5f5f5] hover:border-[#091540] transition disabled:opacity-60"
                disabled={step === steps.length - 1 ? !canSubmit || isSubmitting : false}
              >
                {step === steps.length - 1
                  ? isSubmitting
                    ? "Creando..."
                    : "Crear Proyecto"
                  : "Siguiente"}
              </button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default CreateProject;
