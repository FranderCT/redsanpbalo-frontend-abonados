import { useState } from "react";
import { ModalBase } from "../../../../../Components/Modals/ModalBase";
import { useGetCommentsByRequestIdSupervisionMeter, useCreateAdminCommentSupervisionMeter } from "../../../../CommentRequest/comment-supervision-meter/Hooks/commentSupervisionMeterHooks";
import { toast } from "react-toastify";
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
  const { comments = [], isPending: commentsLoading, refetch } = useGetCommentsByRequestIdSupervisionMeter(request.Id);
  const createAdminCommentMutation = useCreateAdminCommentSupervisionMeter();
  const { UserProfile } = useGetUserProfile();

  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !comment.trim()) {
      toast.error("El asunto y comentario son requeridos", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!UserProfile?.Id) {
      toast.error("Error: No se pudo identificar el usuario", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        Subject: subject.trim(),
        Comment: comment.trim(),
        UserId: UserProfile.Id,
      };

      await createAdminCommentMutation.mutateAsync({
        requestId: request.Id,
        payload,
      });

      toast.success("Comentario enviado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });

      setSubject("");
      setComment("");
      refetch();
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      toast.error("Error al enviar comentario. Intente nuevamente.", {
        position: "top-right",
        autoClose: 3000,
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
    <ModalBase open={open} onClose={onClose} panelClassName="w-full max-w-5xl !p-0 shadow-2xl h-[95vh] max-h-[95vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-white text-[#091540] flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold">Comunicación con {isAdmin ? "el Abonado" : "ASADA"}</h3>
          <p className="text-[#091540] mt-1 text-sm">
            Solicitud #{request.Id} - {request.User?.Name} {request.User?.Surname1}
          </p>
        </div>
      </div>

      {/* Body - Single column con scroll completo */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Información de Solicitud */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Información de la Solicitud
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Nombre Completo</span>
              <p className="text-gray-900 font-medium truncate" title={`${request.User?.Name || ''} ${request.User?.Surname1 || ''} ${request.User?.Surname2 || ''}`}>{request.User?.Name} {request.User?.Surname1} {request.User?.Surname2}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Fecha Solicitud</span>
              <p className="text-gray-900 font-medium truncate" title={String(request.Date)}>{String(request.Date)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">NIS</span>
              <p className="text-gray-900 font-medium truncate" title={String(request.NIS)}>{request.NIS}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Correo Electrónico</span>
              <p className="text-gray-900 font-medium truncate" title={request.User?.Email}>{request.User?.Email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Teléfono</span>
              <p className="text-gray-900 font-medium truncate" title={request.User?.PhoneNumber}>{request.User?.PhoneNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Ubicación</span>
              <p className="text-gray-900 font-medium truncate" title={request.Location}>{request.Location}</p>
            </div>
            {request.Justification && (
              <div className="md:col-span-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <span className="text-xs text-blue-700 uppercase tracking-wide font-semibold block mb-2">Justificación</span>
                <p className="text-gray-900 leading-relaxed break-words">{request.Justification}</p>
              </div>
            )}
          </div>
        </div>

        {/* Comments Thread */}
        <div className="p-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Historial de Comunicación
          </h4>
          
          {commentsLoading ? (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-sm font-medium">Cargando comentarios...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
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
                
                const isMyMessage = UserProfile && commentUser 
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
                  authorName = "Administracion ASADA";
                  authorInitial = "S";
                }

                return (
                  <div
                    key={commentItem.Id}
                    className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}
                  >
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-xl shadow-md overflow-hidden ${
                      isMyMessage
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
                        : "bg-white text-gray-900 border-2 border-gray-200"
                    }`}>
                      {/* Header con avatar y nombre */}
                      <div className={`px-4 py-3 ${
                        isMyMessage ? "bg-blue-600/30" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isMyMessage
                              ? "bg-blue-800 text-white shadow-lg" 
                              : "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800"
                          }`}>
                            {authorInitial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${
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

                      {/* Contenido del comentario */}
                      <div className="px-4 py-4 space-y-3">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          isMyMessage ? "bg-blue-700 text-blue-100" : "bg-gray-200 text-gray-700"
                        }`}>
                          {commentItem.Subject}
                        </div>
                        <p className={`text-sm leading-relaxed break-words whitespace-pre-wrap ${
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

        {/* New Comment Form - Fijo al final */}
        <div className="border-t-2 border-gray-300 bg-white p-6 flex-shrink-0">
          <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Nuevo Comentario
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Asunto</label>
              <input
                type="text"
                placeholder="Ingrese el asunto del comentario"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Comentario</label>
              <textarea
                placeholder="Escriba su observación..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !comment.trim()}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar Comentario
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200  transition"
                disabled={isSubmitting}
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalBase>
  );
}
