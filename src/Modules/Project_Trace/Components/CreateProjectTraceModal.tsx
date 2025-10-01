import { useState } from "react";
import { toast } from "react-toastify";
import { ModalBase } from "../../../Components/Modals/ModalBase";
import type { newProjectTrace } from "../Models/ProjectTrace";
import { useCreateProjectTrace } from "../Hooks/ProjectTraceHooks";
import { useForm } from "@tanstack/react-form";

type Props = { ProjectId: number };

// 🎨 Estilos centralizados
const PANEL = "w-full max-w-xl !p-0 overflow-hidden shadow-2xl";
const WRAP = "bg-white";
const HEADER = "px-6 py-5 border-b border-gray-200";
const TITLE = "text-xl font-bold text-[#091540]";
const SUB = "text-sm text-gray-600";
const SECTION = "p-6";
const GRID = "grid gap-3";
const LABEL = "text-sm text-[#091540]";
const INPUT =
  "w-full px-4 py-2 bg-gray-50 border border-gray-200  outline-none " +
  "focus:ring-2 focus:ring-[#1789FC] focus:border-[#1789FC] placeholder-gray-400";
const TEXTAREA =
  "w-full min-h-[110px] px-4 py-2 resize-y bg-gray-50 border border-gray-200  outline-none " +
  "focus:ring-2 focus:ring-[#1789FC] focus:border-[#1789FC] placeholder-gray-400";
const FOOTER = "mt-4 flex justify-end gap-2";
const BTN_PRIMARY =
  "h-10 px-5  bg-[#091540] text-white hover:bg-[#1789FC] transition disabled:opacity-60";
const BTN_SECONDARY =
  "h-10 px-4 bg-gray-200 text-[#091540] hover:bg-gray-300 transition";
const TRIGGER_BTN =
  "px-4 py-2  bg-[#091540] text-white shadow hover:bg-[#1789FC] transition";

const CreateProjectTraceModal = ({ ProjectId }: Props) => {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateProjectTrace();

  const handleClose = () => {
    toast.warning("Seguimiento cancelado", { position: "top-right", autoClose: 3000 });
    setOpen(false);
  };

  const form = useForm({
    defaultValues: {
      Name: "",
      Observation: "",
      ProjectId, // viene de props
    },
    onSubmit: async ({ value }) => {
      const payload: newProjectTrace = {
        Name: value.Name.trim(),
        Observation: value.Observation.trim(),
        ProjectId,
      };

      try {
        await createMutation.mutateAsync(payload);
        toast.success("Seguimiento creado", { position: "top-right", autoClose: 3000 });
        form.reset();           // 👈 importante: con paréntesis
        setOpen(false);
      } catch (err) {
        console.error(err);
        toast.error("Error al crear el seguimiento", { position: "top-right", autoClose: 3000 });
      }
    },
  });

  return (
    <>
      {/* Botón para abrir modal */}
      <button onClick={() => setOpen(true)} className={TRIGGER_BTN}>
        + Crear seguimiento de proyecto
      </button>

      <ModalBase open={open} onClose={handleClose} panelClassName={PANEL}>
        <div className={WRAP}>
          {/* Header */}
          <header className={HEADER}>
            <h2 className={TITLE}>Nuevo seguimiento</h2>
            <p className={SUB}>Registre un nuevo seguimiento para el proyecto</p>
          </header>

          {/* Body */}
          <section className={SECTION}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className={GRID}
            >
              {/* Nombre del seguimiento */}
              <form.Field name="Name">
                {(field) => (
                  <label className="grid gap-1">
                    <span className={LABEL}>Nombre del seguimiento</span>
                    <input
                      className={INPUT}
                      placeholder="Ej. Reparación de fuga en tramo 2"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  </label>
                )}
              </form.Field>

              {/* Observación */}
              <form.Field name="Observation">
                {(field) => (
                  <label className="grid gap-1">
                    <span className={LABEL}>Observación</span>
                    <textarea
                      className={TEXTAREA}
                      placeholder="Describa brevemente la observación o avance…"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                )}
              </form.Field>

              {/* Footer / Acciones */}
              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <div className={FOOTER}>
                    <button
                      type="submit"
                      className={BTN_PRIMARY}
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? "Registrando…" : "Registrar"}
                    </button>
                    <button type="button" onClick={handleClose} className={BTN_SECONDARY}>
                      Cancelar
                    </button>
                  </div>
                )}
              </form.Subscribe>
            </form>
          </section>
        </div>
      </ModalBase>
    </>
  );
};

export default CreateProjectTraceModal;
