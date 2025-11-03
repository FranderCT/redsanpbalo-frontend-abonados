// import { useForm } from "@tanstack/react-form";
// import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { ModalBase } from "../../../../Components/Modals/ModalBase";
// import { useCreateChangeMeterRequest } from "../../Hooks/Change-Meter/ChangeMeterHooks";

// const CreateChangeMeterModal = () => {
//     const useCreateChangeMeterRequestMutation = useCreateChangeMeterRequest();
//     const { UserProfile } = useGetUserProfile();
//     const [open, setOpen] = useState(false);

//     const handleClose = () => {
//         toast.warning("Solicitud cancelada", { position: "top-right", autoClose: 3000 });
//         form.reset();
//         setOpen(false);
//     };

//     const form = useForm({
//         defaultValues: {
//             Location: '',
//             NIS: 0,
//             Justification: '',
//             UserId: UserProfile?.Id || 0
//         },
//         onSubmit: async ({ value, formApi }) => {
//             try {
//                 await useCreateChangeMeterRequestMutation.mutateAsync(value);
//                 formApi.reset();
//                 setOpen(false);
//             } catch (error) {
//                 console.error("Error al crear la solicitud de cambio de medidor", error);
//             }
//         }
//     });

//     return (
//         <div>
//             <button
//                 onClick={() => setOpen(true)}
//                 className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
//             >
//                 + Solicitar Cambio de Medidor
//             </button>

//             <ModalBase
//                 open={open}
//                 onClose={handleClose}
//                 panelClassName="w-full max-w-lg !p-0 overflow-hidden shadow-2xl"
//             >
//                 {/* Header */}
//                 <div className="px-6 py-4 text-[#091540]">
//                     <h3 className="text-xl font-semibold">Solicitud de Cambio de Medidor</h3>
//                     <p className="text-sm opacity-80">Complete los datos para generar la solicitud</p>
//                 </div>

//                 {/* Divider */}
//                 <div className="border-t border-gray-100" />

//                 {/* Body */}
//                 <form
//                     onSubmit={(e) => {
//                         e.preventDefault();
//                         form.handleSubmit();
//                     }}
//                     className="px-7 py-4 flex flex-col gap-4"
//                 >
//                     {/* Ubicación */}
//                     <form.Field name="Location">
//                         {(field) => (
//                             <label className="grid gap-2">
//                                 <span className="text-sm font-medium text-gray-700">
//                                     Ubicación del medidor <span className="text-red-500">*</span>
//                                 </span>
//                                 <textarea
//                                     autoFocus
//                                     className="w-full min-h-[80px] px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
//                                     placeholder="Ej. 200m este de la plaza central, casa color verde..."
//                                     value={field.state.value}
//                                     onChange={(e) => field.handleChange(e.target.value)}
//                                     rows={3}
//                                     required
//                                 />
//                                 {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
//                                     <p className="text-sm text-red-500 mt-1">
//                                         {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
//                                     </p>
//                                 )}
//                             </label>
//                         )}
//                     </form.Field>

//                     {/* NIS */}
//                     <form.Field name="NIS">
//                         {(field) => (
//                             <label className="grid gap-2">
//                                 <span className="text-sm font-medium text-gray-700">
//                                     Número de Identificación del Suministro (NIS) <span className="text-red-500">*</span>
//                                 </span>
//                                 <input
//                                     type="number"
//                                     className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
//                                     placeholder="Ej. 120"
//                                     value={field.state.value || ''}
//                                     onChange={(e) => field.handleChange(Number(e.target.value))}
//                                     min="1"
//                                     required
//                                 />
//                                 {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
//                                     <p className="text-sm text-red-500 mt-1">
//                                         {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
//                                     </p>
//                                 )}
//                             </label>
//                         )}
//                     </form.Field>

//                     {/* Justificación */}
//                     <form.Field name="Justification">
//                         {(field) => (
//                             <label className="grid gap-2">
//                                 <span className="text-sm font-medium text-gray-700">
//                                     Justificación de la solicitud <span className="text-red-500">*</span>
//                                 </span>
//                                 <textarea
//                                     className="w-full min-h-[100px] px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
//                                     placeholder="Describa el motivo de la solicitud de supervisión del medidor..."
//                                     value={field.state.value}
//                                     onChange={(e) => field.handleChange(e.target.value)}
//                                     rows={4}
//                                     required
//                                 />
//                                 {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
//                                     <p className="text-sm text-red-500 mt-1">
//                                         {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
//                                     </p>
//                                 )}
//                             </label>
//                         )}
//                     </form.Field>

//                     {/* Info del usuario (solo informativo) */}
//                     {UserProfile && (
//                         <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//                             <p className="text-sm text-blue-800">
//                                 <span className="font-medium">Solicitante:</span> {UserProfile.Name} {UserProfile.Surname1} {UserProfile.Surname2}
//                             </p>
//                             <p className="text-xs text-blue-600 mt-1">
//                                 La solicitud será registrada a su nombre
//                             </p>
//                         </div>
//                     )}

//                     {/* Footer */}
//                     <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
//                         {([canSubmit, isSubmitting]) => (
//                             <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
//                                  <button
//                                     type="submit"
//                                     className="h-10 px-6 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60 transition font-medium flex items-center justify-center gap-2"
//                                     disabled={!canSubmit || isSubmitting}
//                                 >
//                                     {isSubmitting && (
//                                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     )}
//                                     {isSubmitting ? "Creando solicitud..." : "Crear Solicitud"}
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={handleClose}
//                                     className="h-10 px-6 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
//                                     disabled={isSubmitting}
//                                 >
//                                     Cancelar
//                                 </button>
                               
//                             </div>
//                         )}
//                     </form.Subscribe>
//                 </form>
//             </ModalBase>
//         </div>
//     );
// }

// export default CreateChangeMeterModal