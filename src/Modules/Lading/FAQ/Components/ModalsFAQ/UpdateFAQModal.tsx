import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../../Components/Modals/ModalBase";
import ConfirmActionModal from "../../../../../Components/Modals/ConfirmActionModal";
import { useState } from "react";
import { useUpdateFAQ } from "../../Hooks/FAQHooks";
import type { FAQ } from "../../Models/FAQ";

type Props = {
  faq: FAQ;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const UpdateFAQModal = ({ faq, open, onClose, onSuccess }: Props) => {
  const updateFAQMutation = useUpdateFAQ();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClose = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    onClose();
  };

  const form = useForm({
    defaultValues: {
      Question: faq?.Question ?? "",
      Answer: faq?.Answer ?? "",
      IsActive: faq?.IsActive ?? true,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateFAQMutation.mutateAsync({
          id: faq.Id,
          data: value,
        });

        toast.success("¡FAQ actualizada!", {
          position: "top-right",
          autoClose: 3000,
        });

        formApi.reset();
        setOpenConfirm(false);
        onClose?.();
        onSuccess?.();
      } catch (err) {
        console.error("Error al actualizar FAQ", err);
        toast.error("Error al actualizar la FAQ", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  return (
    <>
      {/* Modal principal de edición */}
      <ModalBase
        open={open}
        onClose={handleClose}
        panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <h3 className="text-xl font-bold text-[#091540]">Editar FAQ</h3>
        </div>

        {/* Body */}
        <div className="p-6 bg-white">
          {/* Vista previa */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Información actual
            </h4>

            <dl className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                  Pregunta
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-words">
                  {faq.Question ?? "-"}
                </dd>
              </div>
              <div className="bg-gray-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                  Respuesta
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-words">
                  {faq.Answer ?? "-"}
                </dd>
              </div>
              <div className="bg-gray-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                  Estado
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-words">
                  {faq.IsActive ? "Activo" : "Inactivo"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Formulario de edición */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="grid gap-4"
          >
            <form.Field name="Question">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Nueva Pregunta</span>
                  <input
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Escriba la nueva pregunta"
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="Answer">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Nueva Respuesta</span>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC] min-h-[120px]"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Escriba la nueva respuesta"
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="IsActive">
              {(field) => (
                <label className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Activo:</span>
                  <input
                    type="checkbox"
                    checked={!!field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                </label>
              )}
            </form.Field>

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="mt-2 flex justify-end items-center gap-2">
                  <button
                    type="button"
                    disabled={!canSubmit || isSubmitting}
                    onClick={() => {
                      if (canSubmit && !isSubmitting) setOpenConfirm(true);
                    }}
                    className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                  >
                    {isSubmitting ? "Guardando…" : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </form.Subscribe>
          </form>
        </div>
      </ModalBase>

      {/* Modal de confirmación */}
      {openConfirm && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none"
          aria-hidden={false}
        >
          <div
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={() => setOpenConfirm(false)}
          />
          <div className="relative pointer-events-auto">
            <ConfirmActionModal
              description="Se actualizará la información de la FAQ."
              confirmLabel="Confirmar"
              cancelLabel="Cancelar"
              onConfirm={() => {
                setOpenConfirm(false);
                form.handleSubmit();
              }}
              onCancel={handleClose}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateFAQModal;
