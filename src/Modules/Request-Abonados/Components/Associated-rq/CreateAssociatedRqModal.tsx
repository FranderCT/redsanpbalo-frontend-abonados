import { useForm } from "@tanstack/react-form";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { useState } from "react";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import { useCreateAssociatedRequest } from "../../Hooks/Associated/AssociatedRqHooks";

const CreateAssociatedRqModal = () => {
    const useCreateAssociatedRequestMutation = useCreateAssociatedRequest();
    const { UserProfile } = useGetUserProfile();
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        toast.warning("Solicitud cancelada", { position: "top-right", autoClose: 3000 });
        form.reset();
        setOpen(false);
    };

    const form = useForm({
        defaultValues: {
            IDcard: UserProfile?.IDcard || '',
            Name: UserProfile?.Name || '',
            Justification: '',
            Surname1: UserProfile?.Surname1 || '',
            Surname2: UserProfile?.Surname2 || '',
            NIS: UserProfile?.Nis || 0,
        },
        onSubmit: async ({ value, formApi }) => {
            try {
                await useCreateAssociatedRequestMutation.mutateAsync({
                    ...value,
                    NIS: Number(value.NIS) || 0,
                });
                formApi.reset();
                setOpen(false);
            } catch (error) {
                console.error("Error al crear la solicitud de asociado", error);
                setOpen(false);
            }
        }
    });

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
            >
                + Solicitar Asociación
            </button>

            <ModalBase
                open={open}
                onClose={handleClose}
                panelClassName="w-full max-w-lg !p-0 overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="px-6 py-4 text-[#091540]">
                    <h3 className="text-xl font-semibold">Solicitud de Asociación</h3>
                    <p className="text-sm opacity-80">Sus datos se completarán automáticamente, solo escriba la justificación</p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Body */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="px-7 py-4 flex flex-col gap-4"
                >
                    {/* Datos del solicitante (autocompletados y de solo lectura) */}
                    {UserProfile && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos del Solicitante</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <span className="text-xs text-gray-500">Cédula</span>
                                    <p className="text-sm font-medium text-gray-800">{UserProfile.IDcard}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">NIS</span>
                                    <p className="text-sm font-medium text-gray-800">{UserProfile.Nis}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-xs text-gray-500">Nombre completo</span>
                                    <p className="text-sm font-medium text-gray-800">
                                        {UserProfile.Name} {UserProfile.Surname1} {UserProfile.Surname2}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 italic">
                                Estos datos se tomarán automáticamente de su perfil
                            </p>
                        </div>
                    )}

                    {/* Justificación - único campo editable */}
                    <form.Field name="Justification">
                        {(field) => (
                            <label className="grid gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Justificación de la solicitud de asociado <span className="text-red-500">*</span>
                                </span>
                                <textarea
                                    autoFocus
                                    className="w-full min-h-[120px] px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition shadow-sm resize-none"
                                    placeholder="Describa el motivo de su solicitud para ser asociado"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    rows={2}
                                    required
                                />
                                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Proporcione una justificación clara y detallada para su solicitud
                                </p>
                            </label>
                        )}
                    </form.Field>

                    {/* Footer */}
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                                 <button
                                    type="submit"
                                    className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition font-medium flex items-center justify-center gap-2"
                                    disabled={!canSubmit || isSubmitting}
                                >
                                    {isSubmitting && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {isSubmitting ? "Creando solicitud..." : "Crear Solicitud"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="h-10 px-6 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                               
                            </div>
                        )}
                    </form.Subscribe>
                </form>
            </ModalBase>
        </div>
    );
}

export default CreateAssociatedRqModal