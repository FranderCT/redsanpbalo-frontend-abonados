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

const EditPhysicalSupplierModal = ({ supplier: physicalSupplier, open, onClose, onSuccess }: Props) => {
  const updateSupplierMutation = useEditPhysicalSupplier();

  const SPANSTYLES = "text text-[#222]";
  const LABELSTYLES = "grid gap-1";
  const INPUTSTYLES = "w-full px-4 py-2 bg-gray-50 border";
  
  const supplier = physicalSupplier.Supplier;
  
  const form = useForm({
    defaultValues: {
      IDcard: supplier?.IDcard ?? '',
      Name: supplier?.Name ?? '',
      Surname1: physicalSupplier.Surname1 ?? '',
      Surname2: physicalSupplier.Surname2 ?? '',
      Email: supplier?.Email ?? '',
      PhoneNumber: supplier?.PhoneNumber ?? '',
      Location: supplier?.Location ?? '',
      IsActive: supplier?.IsActive ?? true,
    },
    validators:{
      onChange: UpdatePhysicalSupplierSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await updateSupplierMutation.mutateAsync({
          id: physicalSupplier.Id,
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
    if (!physicalSupplier || !supplier) return;
    form.setFieldValue("IDcard", supplier.IDcard ?? "");
    form.setFieldValue("Name", supplier.Name ?? "");
    form.setFieldValue("Surname1", physicalSupplier.Surname1 ?? "");
    form.setFieldValue("Surname2", physicalSupplier.Surname2 ?? "");
    form.setFieldValue("Email", supplier.Email ?? "");
    form.setFieldValue("PhoneNumber", supplier.PhoneNumber ?? "");
    form.setFieldValue("Location", supplier.Location ?? "");
    form.setFieldValue("IsActive", supplier.IsActive ?? true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [physicalSupplier, open]);

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
      panelClassName="w-[min(90vw,700px)] p-4 flex flex-col max-h-[90vh]"
    >
      <header className="flex flex-col">
        <h2 className="text-2xl text-[#091540] font-bold">Editar proveedor físico</h2>
        <p className="text-md">Actualice la información del proveedor</p>
      </header>

      <div className="border-b border-[#222]/10 my-2" />

      <form
        id="create-physical-supplier-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >

        {/* IDcard */}
        <form.Field name="IDcard">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Número de Cédula</span>
              <input
                className={INPUTSTYLES}
                placeholder="ejm. 504440123"
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

        {/* Name */}
        <form.Field name="Name">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Nombre</span>
              <input
                className={INPUTSTYLES}
                placeholder="ejm. GILBERT ADAN"
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

        {/* Surname1 */}
        <form.Field name="Surname1">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Primer apellido</span>
              <input
                className={INPUTSTYLES}
                placeholder="ejm. CERDAS"
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

        {/* Surname2 */}
        <form.Field name="Surname2">
          {(field) => (
            <label className={LABELSTYLES}>
              <span className={SPANSTYLES}>Segundo apellido</span>
              <input
                className={INPUTSTYLES}
                placeholder="ejm. CHAVES"
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
                placeholder={supplier?.Location || "Ingrese la dirección"}
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
      </form>
      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="flex-shrink-0 mt-4 flex justify-end gap-2 border-t border-gray-200 pt-3">
              <button
                form="create-physical-supplier-form"
                type="submit"
                className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                form="create-physical-supplier-form"
                type="button"
                onClick={handleClose}
                className="h-10 px-4 bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          )}
      </form.Subscribe>
    </ModalBase>
  );
};

export default EditPhysicalSupplierModal;
