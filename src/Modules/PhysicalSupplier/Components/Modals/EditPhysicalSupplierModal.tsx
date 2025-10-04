import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useEditPhysicalSupplier } from "../../Hooks/PhysicalSupplierHooks";
import type { PhysicalSupplier } from "../../Models/PhysicalSupplier";
import { UpdatePhysicalSupplierSchema } from "../../Schemas/UpdatePhysicalSupplierSchema";

type Props = {
  supplier: PhysicalSupplier;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const EditPhysicalSupplierModal = ({ supplier, open, onClose, onSuccess }: Props) => {
  const updateSupplierMutation = useEditPhysicalSupplier();

  const SPANSTYLES = "text text-[#222]";
  const LABELSTYLES = "grid gap-1";
  const INPUTSTYLES = "w-full px-4 py-2 bg-gray-50 border";
  
  const form = useForm({
    defaultValues: {
      Email: supplier.Email ?? '',
      PhoneNumber: supplier.PhoneNumber ?? '',
      Location:  supplier.Location ?? '',
      IsActive : supplier.IsActive ?? true,
    },
    validators:{
      onChange: UpdatePhysicalSupplierSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await updateSupplierMutation.mutateAsync({
          id: supplier.Id,
          data: value,
        });
        form.reset();
        onSuccess?.();
        onClose?.();
      } catch (err) {
        console.error("Error al actualizar el proveedor", err);
      }
    },
  });

  // Cuando cambia el supplier o se abre el modal, sincroniza los campos
  useEffect(() => {
    if (!supplier) return;
    form.setFieldValue("Email", supplier.Email ?? "");
    form.setFieldValue("PhoneNumber", supplier.PhoneNumber ?? "");
    form.setFieldValue("Location", supplier.Location ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier, open]);

  const handleClose = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    form.reset();
    onClose();
  };

  const toMsg = (e: unknown) =>
  typeof e === 'string' ? e : (e as any)?.message ?? '';

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      panelClassName="w-[min(30vw,700px)] p-4"
    >
      <header className="flex flex-col">
        <h2 className="text-2xl text-[#091540] font-bold">Editar proveedor físico</h2>
        <p className="text-md">Actualice la información del proveedor</p>
      </header>

      <div className="border-b border-[#222]/10 my-2" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="grid gap-3"
      >

        {/* Email */}
        <form.Field name="Email">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Correo electrónico del proveedor</span>
              <input
                className={INPUTSTYLES}
                placeholder="ejm. joseroman2@gmail.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors[0] && (
                <p className="text-sm text-red-500 mt-1">
                  {toMsg(field.state.meta.errors[0] as any)}
                </p>
              )}
            </label>
          )}
        </form.Field>

        {/* Teléfono (PhoneField) */}
        <form.Field name="PhoneNumber">
          {(field) => (
            <>
              <PhoneField
                value={field.state.value}
                onChange={(val) => field.handleChange(val ?? "")}
                defaultCountry="CR"
                required
                error={
                  field.state.meta.isTouched && field.state.meta.errors[0]
                    ? toMsg(field.state.meta.errors[0])
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ??
                    toMsg(field.state.meta.errors[0])}
                </p>
              )}
            </>
          )}
        </form.Field>

        {/* Dirección */}
        <form.Field name="Location">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Dirección del proveedor</span>
              <textarea
                className={`${INPUTSTYLES} resize-none min-h-[70px] leading-relaxed`}
                placeholder={`${supplier.Location}`}
                rows={4}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors[0] && (
                <p className="text-sm text-red-500 mt-1">
                  {toMsg(field.state.meta.errors[0] as any)}
                </p>
              )}
            </label>
          )}
        </form.Field>

        <form.Field name="IsActive">
          {(field) => (
            <label className="flex items-center gap-3 cursor-pointer select-none">
              {/* Texto dinámico */}
              <span className="text-sm text-gray-700">
                {field.state.value ? "Activo" : "Inactivo"}
              </span>

              {/* Toggle */}
              <div className="relative">
                <input
                  type="checkbox"
                  checked={!!field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5"></div>
              </div>

              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ??
                    toMsg(field.state.meta.errors[0])}
                </p>
              )}
            </label>
          )}
        </form.Field>


        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="submit"
                className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                disabled={!canSubmit}
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
    </ModalBase>
  );
};

export default EditPhysicalSupplierModal;
