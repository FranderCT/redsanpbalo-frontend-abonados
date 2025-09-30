import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import ConfirmActionModal from "../../../../Components/Modals/ConfirmActionModal";
import { useState } from "react";
import type { Unit } from "../../Models/unit";
import { useUpdateUnitMeasure } from "../../Hooks/UnitMeasureHooks";
import { UpdateUnitMeasureSchemas } from "../../Schemas/UnitMeasureSchemas";

type Props = {
  unit: Unit;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const UpdateUnitMeasureModal = ({ unit, open, onClose, onSuccess }: Props) => {
  const updateUnitModalMutation = useUpdateUnitMeasure();
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleClose = () => {
      toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
      onClose();
  };
  const form = useForm({
    validators: {
      onChange: UpdateUnitMeasureSchemas,
    },
    defaultValues: {
      Name: unit?.Name ?? "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateUnitModalMutation.mutateAsync({
          id: unit.Id,
          data: value,
        });

        toast.success("¡Unidad de medida actualizada!", {
          position: "top-right",
          autoClose: 3000,
        });

        formApi.reset();
        setOpenConfirm(false); // por si estaba abierto
        onClose?.();
        onSuccess?.();
      } catch (err) {
        console.error("error desconocido", err);
        toast.error("Error al actualizar la unidad de medida", {
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
        panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <h3 className="text-xl font-bold text-[#091540]">Editar Unidad de Medida</h3>
        </div>

        {/* Body */}
        <div className="p-6 bg-white">
          {/* Vista previa (información actual) */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Información de la Unidad de Medida
            </h4>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className=" bg-gray-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                  Nombre de la Unidad de Medida
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-words">
                  {unit.Name ?? "-"}
                </dd>
              </div>
              <div className=" bg-gray-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                  Estado
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-words">
                  {unit.IsActive ? "Activo" : "Inactivo"}
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
            <form.Field name="Name">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">
                    Nuevo Nombre de la Unidad de Medida
                  </span>
                  <input
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
                    value={field.state.value}
                    inputMode="text"
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Escriba el nuevo nombre de la unidad de medida"
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ??
                          String(field.state.meta.errors[0])}
                      </p>
                    )}
                </label>
              )}
            </form.Field>

            <form.Field name="IsActive">
              {(field) => (
                <label className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Activo: 
                  </span>
                  <input
                    type="checkbox"
                    checked={!!field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        {(field.state.meta.errors[0] as any)?.message ??
                          String(field.state.meta.errors[0])}
                      </p>
                    )}
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
                      // sólo abrimos confirm si pasa validaciones y no está enviando
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

      {/* Modal de confirmación  */}
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
                description="Se actualizará la información de la unidad de medida."
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

export default UpdateUnitMeasureModal;
