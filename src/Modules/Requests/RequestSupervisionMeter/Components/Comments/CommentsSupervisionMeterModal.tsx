import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { toast } from "sonner";
import { useGetCommentsByRequestIdSupervisionMeter, useCreateAdminCommentSupervisionMeter } from "../../../../CommentRequest/comment-supervision-meter/Hooks/commentSupervisionMeterHooks";
import type { ReqSupervisionMeter } from "../../Models/ReqSupervisionMeter";
import { useGetUserProfile } from "../../../../Users/Hooks/UsersHooks";

interface CommentsSupervisionMeterModalProps {
  open: boolean;
  onClose: () => void;
  request: ReqSupervisionMeter;
  isAdmin?: boolean;
}

export function CommentsSupervisionMeterModal({
  open,
  onClose,
  request,
  isAdmin = false,
}: CommentsSupervisionMeterModalProps) {
  const requesterFullName = [
    request.User?.Name,
    request.User?.Surname1,
    request.User?.Surname2,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const { comments = [], isPending: commentsLoading, refetch } =
    useGetCommentsByRequestIdSupervisionMeter(request.Id);
  const createAdminCommentMutation = useCreateAdminCommentSupervisionMeter();
  const { UserProfile } = useGetUserProfile();

  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!subject.trim() || !comment.trim()) {
      toast.error("El asunto y comentario son requeridos", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    if (!UserProfile?.Id) {
      toast.error("Error: No se pudo identificar el usuario", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createAdminCommentMutation.mutateAsync({
        requestId: request.Id,
        payload: {
          Subject: subject.trim(),
          Comment: comment.trim(),
          UserId: UserProfile.Id,
        },
      });

      toast.success("Comentario enviado exitosamente", {
        position: "top-right",
        duration: 3000,
      });

      setSubject("");
      setComment("");
      refetch();
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      toast.error("Error al enviar comentario. Intente nuevamente.", {
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="flex h-[95vh] max-h-[95vh] max-w-5xl flex-col overflow-hidden rounded-none p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            Comunicación de solicitud de supervisión de medidor #{request.Id}
          </DialogTitle>
          <DialogDescription>
            Revise la información y comentarios relacionados con la solicitud de supervisión de medidor.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white px-6 py-4 text-[#091540] flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold">
              Comunicación con {isAdmin ? "el Abonado" : "ASADA"}
            </h3>
            <p className="mt-1 text-sm text-[#091540]">
              Solicitud #{request.Id} - {requesterFullName || "Solicitante"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="border-b border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información de la Solicitud
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Nombre Completo</span>
                <p className="truncate font-medium text-gray-900" title={requesterFullName || "Sin nombre"}>
                  {requesterFullName || "Sin nombre"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Cédula</span>
                <p className="truncate font-medium text-gray-900" title={request.User?.IDcard || "Sin cédula"}>
                  {request.User?.IDcard || "Sin cédula"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">NIS</span>
                <p className="truncate font-medium text-gray-900" title={String(request.NIS)}>
                  {request.NIS}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Correo Electrónico</span>
                <p className="truncate font-medium text-gray-900" title={request.User?.Email}>
                  {request.User?.Email}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Teléfono</span>
                <p className="truncate font-medium text-gray-900" title={request.User?.PhoneNumber}>
                  {request.User?.PhoneNumber}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Ubicación</span>
                <p className="truncate font-medium text-gray-900" title={request.Location || "Sin ubicación"}>
                  {request.Location || "Sin ubicación"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Fecha Solicitud</span>
                <p className="truncate font-medium text-gray-900" title={formatDate(request.Date)}>
                  {formatDate(request.Date)}
                </p>
              </div>
              {request.Justification ? (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 md:col-span-3">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-blue-700">Justificación</span>
                  <p className="break-words leading-relaxed text-gray-900">
                    {request.Justification}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4 p-6">
            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Historial de Comunicación
            </h4>

            {commentsLoading ? (
              <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-gray-500">
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-sm font-medium">Cargando comentarios...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-gray-500">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-base font-semibold">No hay comentarios aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((commentItem) => {
                  const commentUser = commentItem.User;
                  const isMyMessage =
                    UserProfile && commentUser
                      ? UserProfile.Id === commentUser.Id
                      : false;

                  let authorName = "";
                  let authorInitial = "?";

                  if (commentUser) {
                    authorName = `${commentUser.Name || ""} ${commentUser.Surname1 || ""} ${commentUser.Surname2 || ""}`.trim();
                    authorInitial = commentUser.Name?.charAt(0).toUpperCase() || "U";
                    if (!authorName) {
                      authorName = "Usuario";
                      authorInitial = "U";
                    }
                  } else {
                    authorName = "Administración ASADA";
                    authorInitial = "S";
                  }

                  return (
                    <div
                      key={commentItem.Id}
                      className={`mb-4 flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] overflow-hidden rounded-xl shadow-md md:max-w-[70%] ${
                        isMyMessage
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                          : "border-2 border-gray-200 bg-white text-gray-900"
                      }`}>
                        <div className={`px-4 py-3 ${
                          isMyMessage ? "bg-blue-600/30" : "bg-gray-50"
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              isMyMessage
                                ? "bg-blue-800 text-white shadow-lg"
                                : "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800"
                            }`}>
                              {authorInitial}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-sm font-bold ${
                                isMyMessage ? "text-white" : "text-gray-900"
                              }`}>
                                {authorName}
                              </p>
                              <p className={`text-xs ${
                                isMyMessage ? "text-blue-100" : "text-gray-500"
                              }`}>
                                {formatDate(commentItem.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 px-4 py-4">
                          <div className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            isMyMessage ? "bg-blue-700 text-blue-100" : "bg-gray-200 text-gray-700"
                          }`}>
                            {commentItem.Subject}
                          </div>
                          <p className={`break-words whitespace-pre-wrap text-sm leading-relaxed ${
                            isMyMessage ? "text-white" : "text-gray-800"
                          }`}>
                            {commentItem.Comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t-2 border-gray-300 bg-white p-6 flex-shrink-0">
            <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Nuevo Comentario
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Asunto</label>
                <input
                  type="text"
                  placeholder="Ingrese el asunto del comentario"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Comentario</label>
                <textarea
                  placeholder="Escriba su observación o solicitud..."
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !subject.trim() || !comment.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      {isAdmin ? "Enviar Comentario" : "Enviar Respuesta"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
