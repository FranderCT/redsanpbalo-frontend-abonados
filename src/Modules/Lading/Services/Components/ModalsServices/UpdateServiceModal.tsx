import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../../Components/Modals/ModalBase";
import ConfirmActionModal from "../../../../../Components/Modals/ConfirmActionModal";
import { useState } from "react";
import { useUpdateService } from "../../Hooks/ServicesHooks";
import type { Service } from "../../Models/Services";
import { 
  Activity, 
  BadgeCheck, 
  BellRing, 
  MessageCircle, 
  Zap, 
  Droplets, 
  Wrench, 
  FileText, 
  Phone,
  ChevronDown
} from "lucide-react";

const ICON_OPTIONS = [
  { value: "activity", label: "Actividad", Icon: Activity },
  { value: "badge-check", label: "Verificado", Icon: BadgeCheck },
  { value: "bell-ring", label: "Notificación", Icon: BellRing },
  { value: "message-circle", label: "Mensaje", Icon: MessageCircle },
  { value: "zap", label: "Energía", Icon: Zap },
  { value: "droplets", label: "Agua", Icon: Droplets },
  { value: "wrench", label: "Herramientas", Icon: Wrench },
  { value: "file-text", label: "Documento", Icon: FileText },
  { value: "phone", label: "Teléfono", Icon: Phone },
];

type Props = {
  service: Service;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const UpdateServiceModal = ({ service, open, onClose, onSuccess }: Props) => {
  const updateServiceMutation = useUpdateService();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClose = () => {
    toast.warning("Edición cancelada", { position: "top-right", autoClose: 3000 });
    onClose();
  };

  const form = useForm({
    defaultValues: {
      Icon: service?.Icon ?? "",
      Title: service?.Title ?? "",
      Description: service?.Description ?? "",
      IsActive: service?.IsActive ?? true,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await updateServiceMutation.mutateAsync({
          id: service.Id,
          data: value,
        });

        toast.success("¡Servicio actualizado!", {
          position: "top-right",
          autoClose: 3000,
        });

        formApi.reset();
        setOpenConfirm(false);
        onClose?.();
        onSuccess?.();
      } catch (err) {
        console.error("Error al actualizar servicio", err);
        toast.error("Error al actualizar el servicio", {
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
          <h3 className="text-xl font-bold text-[#091540]">Editar Servicio</h3>
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
                  Icono
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-all">
                  {service.Icon ?? "-"}
                </dd>
              </div>
              <div className="bg-gray-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                  Título
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-words">
                  {service.Title ?? "-"}
                </dd>
              </div>
              <div className="bg-gray-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                  Descripción
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-words">
                  {service.Description ?? "-"}
                </dd>
              </div>
              <div className="bg-gray-50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                  Estado
                </dt>
                <dd className="mt-1 text-sm text-[#091540] break-words">
                  {service.IsActive ? "Activo" : "Inactivo"}
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
            <form.Field name="Icon">
              {(field) => {
                const selectedIcon = ICON_OPTIONS.find(opt => opt.value === field.state.value);
                const IconComponent = selectedIcon?.Icon;

                return (
                  <label className="grid gap-1">
                    <span className="text-sm text-gray-700">Nuevo Icono del Servicio</span>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC] appearance-none pr-10"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        <option value="">Seleccione un icono</option>
                        {ICON_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-[#1789FC]" />
                        )}
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    {selectedIcon && IconComponent && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded flex items-center gap-3">
                        <IconComponent className="w-6 h-6 text-[#1789FC]" />
                        <span className="text-sm text-gray-700">
                          Vista previa: <strong>{selectedIcon.label}</strong>
                        </span>
                      </div>
                    )}
                  </label>
                );
              }}
            </form.Field>

            <form.Field name="Title">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Nuevo Título</span>
                  <input
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC]"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Escriba el nuevo título"
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="Description">
              {(field) => (
                <label className="grid gap-1">
                  <span className="text-sm text-gray-700">Nueva Descripción</span>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-[#1789FC] min-h-[120px]"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Escriba la nueva descripción"
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
              description="Se actualizará la información del servicio."
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

export default UpdateServiceModal;
