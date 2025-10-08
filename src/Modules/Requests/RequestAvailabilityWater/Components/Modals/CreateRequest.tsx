// import { useEffect, useMemo, useState } from "react";
// import { useForm } from "@tanstack/react-form";
// import { toast } from "react-toastify";
// import { ModalBase } from "../../../../../Components/Modals/ModalBase";
// import { useCreateReqAvailWater } from "../../Hooks/ReqAvailWaterHooks";
// import { useGetAllRequestStates } from "../../../StateRequest/Hooks/RequestStateHook";

// import type { NewReqAvailWater } from "../../Models/ReqAvailWater";
// import { useGetAllUsers, useGetUserProfile } from "../../../../Users/Hooks/UsersHooks";

// type Props = {
//   buttonText?: string;
//   defaultStateRequestId?: number; // si quieres precargar un estado
//   onCreated?: () => void;
// };

// const toLines = (arr: string[]) => (arr && arr.length ? arr.join("\n") : "");
// const toArray = (text: string) =>
//   text.split("\n").map((s) => s.trim()).filter(Boolean);

// export default function CreateRequest({
//   buttonText = "+ Nueva Solicitud",
//   defaultStateRequestId,
//   onCreated,
// }: Props) {
//   const [open, setOpen] = useState(false);

//   // datos: estados de solicitud, usuarios y perfil
//   const createMutation = useCreateReqAvailWater();
//   const { projectStates = [], projectStatesLoading } = useGetAllRequestStates();
//   const { users = [], isPending: usersLoading } = useGetAllUsers();
//   const { UserProfile } = useGetUserProfile?.() ?? { UserProfile: undefined as any };

//   // estado inicial
//   const initial: NewReqAvailWater = useMemo(
//     () => ({
//       Justification: "",
//       IdCardFiles: [],
//       PlanoPrintFiles: [],
//       LiteralCertificateFile: "",
//       RequestLetterFile: "",
//       ConstructionPermitFile: "",
//       UserId: UserProfile?.Id ?? 0,                     // preselecciona si hay perfil
//       StateRequestId: defaultStateRequestId ?? 0,
//     }),
//     [UserProfile?.Id, defaultStateRequestId]
//   );

//   const form = useForm({
//     defaultValues: initial,
//     onSubmit: async ({ value }) => {
//       try {
//         // Validaciones mínimas
//         if (!value.UserId || value.UserId <= 0) {
//           toast.error("Debe seleccionar un usuario solicitante");
//           return;
//         }
//         if (!value.StateRequestId || value.StateRequestId <= 0) {
//           toast.error("Debe seleccionar el estado de la solicitud");
//           return;
//         }

//         await createMutation.mutateAsync(value);
//         toast.success("¡Solicitud creada!");
//         form.reset();
//         setOpen(false);
//         onCreated?.();
//       } catch {
//         toast.error("Error al crear la solicitud");
//       }
//     },
//   });

//   // Si abres el modal cuando todavía no se ha resuelto el perfil/usuarios,
//   // puedes forzar a setear UserId cuando lleguen (opcional)
//   useEffect(() => {
//     if (open && UserProfile?.Id && !form.state.values.UserId) {
//       form.setFieldValue("UserId", UserProfile.Id);
//     }
//   }, [open, UserProfile?.Id]);

//   const handleClose = () => {
//     toast.warning("Registro cancelado", { position: "top-right", autoClose: 3000 });
//     setOpen(false);
//   };

//   return (
//     <>
//       <button
//         onClick={() => setOpen(true)}
//         className="px-4 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
//       >
//         {buttonText}
//       </button>

//       <ModalBase open={open} onClose={handleClose} panelClassName="w-full max-w-2xl !p-0 overflow-hidden shadow-2xl">
//         {/* Header */}
//         <div className="px-6 py-5 text-[#091540] border-b">
//           <h3 className="text-xl font-bold">Crear Solicitud de Disponibilidad de Agua</h3>
//           <p className="text-sm opacity-90">Complete los campos requeridos</p>
//         </div>

//         {/* Body */}
//         <div className="p-6">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               form.handleSubmit();
//             }}
//             className="grid gap-3"
//           >
//             {/* Usuario solicitante (SIEMPRE visible para que la admin elija) */}
//             <form.Field name="UserId">
//               {(field) => (
//                 <label className="grid gap-1">
//                   <span className="text-sm font-medium">Usuario solicitante</span>
//                   <select
//                     className="w-full px-4 py-2 bg-gray-50 border"
//                     value={field.state.value}
//                     onChange={(e) => field.handleChange(Number(e.target.value))}
//                     disabled={usersLoading}
//                   >
//                     <option value={0} disabled>
//                       {usersLoading ? "Cargando usuarios..." : "Seleccione usuario"}
//                     </option>
//                     {users.map((u) => (
//                       <option key={u.Id} value={u.Id}>
//                         {u.Name}
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               )}
//             </form.Field>

//             {/* Justificación */}
//             <form.Field name="Justification">
//               {(field) => (
//                 <label className="grid gap-1">
//                   <span className="text-sm font-medium">Justificación (opcional)</span>
//                   <textarea
//                     className="w-full px-4 py-2 bg-gray-50 border min-h-24"
//                     placeholder="Explique brevemente la solicitud…"
//                     value={field.state.value ?? ""}
//                     onChange={(e) => field.handleChange(e.target.value)}
//                   />
//                 </label>
//               )}
//             </form.Field>

//             {/* IdCardFiles */}
//             <form.Field name="IdCardFiles">
//               {(field) => (
//                 <label className="grid gap-1">
//                   <span className="text-sm font-medium">Identificaciones (una por línea)</span>
//                   <textarea
//                     className="w-full px-4 py-2 bg-gray-50 border min-h-24"
//                     placeholder={"id_frente.png\nid_reverso.png"}
//                     value={toLines(field.state.value)}
//                     onChange={(e) => field.handleChange(toArray(e.target.value))}
//                   />
//                 </label>
//               )}
//             </form.Field>

//             {/* PlanoPrintFiles */}
//             <form.Field name="PlanoPrintFiles">
//               {(field) => (
//                 <label className="grid gap-1">
//                   <span className="text-sm font-medium">Planos (una ruta por línea)</span>
//                   <textarea
//                     className="w-full px-4 py-2 bg-gray-50 border min-h-24"
//                     placeholder={"plano_1.pdf\nplano_2.pdf"}
//                     value={toLines(field.state.value)}
//                     onChange={(e) => field.handleChange(toArray(e.target.value))}
//                   />
//                 </label>
//               )}
//             </form.Field>

//             {/* LiteralCertificateFile */}
//             <form.Field name="LiteralCertificateFile">
//               {(field) => (
//                 <label className="grid gap-1">
//                   <span className="text-sm font-medium">Certificación literal (archivo)</span>
//                   <input
//                     className="w-full px-4 py-2 bg-gray-50 border"
//                     placeholder="literal.pdf"
//                     value={field.state.value ?? ""}
//                     onChange={(e) => field.handleChange(e.target.value)}
//                   />
//                 </label>
//               )}
//             </form.Field>

//             {/* RequestLetterFile */}
//             <form.Field name="RequestLetterFile">
//               {(field) => (
//                 <label className="grid gap-1">
//                   <span className="text-sm font-medium">Carta de solicitud (archivo)</span>
//                   <input
//                     className="w-full px-4 py-2 bg-gray-50 border"
//                     placeholder="carta.pdf"
//                     value={field.state.value ?? ""}
//                     onChange={(e) => field.handleChange(e.target.value)}
//                   />
//                 </label>
//               )}
//             </form.Field>

//             {/* ConstructionPermitFile */}
//             <form.Field name="ConstructionPermitFile">
//               {(field) => (
//                 <label className="grid gap-1">
//                   <span className="text-sm font-medium">Permiso de construcción (archivo)</span>
//                   <input
//                     className="w-full px-4 py-2 bg-gray-50 border"
//                     placeholder="permiso.pdf"
//                     value={field.state.value ?? ""}
//                     onChange={(e) => field.handleChange(e.target.value)}
//                   />
//                 </label>
//               )}
//             </form.Field>

//             {/* Estado de la solicitud */}
//             <form.Field name="StateRequestId">
//               {(field) => (
//                 <label className="grid gap-1">
//                   <span className="text-sm font-medium">Estado de la solicitud</span>
//                   <select
//                     className="w-full px-4 py-2 bg-gray-50 border"
//                     value={field.state.value}
//                     onChange={(e) => field.handleChange(Number(e.target.value))}
//                     disabled={projectStatesLoading}
//                   >
//                     <option value={0} disabled>
//                       {projectStatesLoading ? "Cargando estados..." : "Seleccione estado"}
//                     </option>
//                     {projectStates.map((s) => (
//                       <option key={s.Id} value={s.Id}>
//                         {s.Name}
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               )}
//             </form.Field>

//             {/* Footer */}
//             <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
//               {([canSubmit, isSubmitting]) => (
//                 <div className="mt-4 flex justify-end gap-2">
//                   <button
//                     type="submit"
//                     className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
//                     disabled={!canSubmit}
//                   >
//                     {isSubmitting ? "Registrando…" : "Registrar"}
//                   </button>
//                   <button type="button" onClick={handleClose} className="h-10 px-4 bg-gray-200 hover:bg-gray-300">
//                     Cancelar
//                   </button>
//                 </div>
//               )}
//             </form.Subscribe>
//           </form>
//         </div>
//       </ModalBase>
//     </>
//   );
// }
