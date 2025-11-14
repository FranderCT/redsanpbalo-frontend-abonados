import { useState } from "react";
import { ModalBase } from "../../../../../Components/Modals/ModalBase";
import { useGetCommentsByRequestIdAvailabilityWater, useCreateAdminCommentAvailabilityWater, useReplyWithFilesAvailabilityWater } from "../../../../CommentRequest/comment-availability-water/Hooks/commentAvailWaterHooks";
import { toast } from "react-toastify";
import type { ReqAvailWater } from "../../Models/ReqAvailWater";
import { useGetUserProfile } from "../../../../Users/Hooks/UsersHooks";
import { useReqAvailWaterFolderLink } from "../../Hooks/ReqAvailWaterHooks";

interface CommentsAvailWaterModalProps {
  open: boolean;
  onClose: () => void;
  request: ReqAvailWater;
  isAdmin?: boolean;
}

export function CommentsAvailWaterModal({
  open,
  onClose,
  request,
  isAdmin = false,
}: CommentsAvailWaterModalProps) {
  const { comments = [], isPending: commentsLoading, refetch } = useGetCommentsByRequestIdAvailabilityWater(request.Id);
  const createAdminCommentMutation = useCreateAdminCommentAvailabilityWater();
  const replyWithFilesMutation = useReplyWithFilesAvailabilityWater();
  const { UserProfile } = useGetUserProfile();
  const folderLinkMutation = useReqAvailWaterFolderLink();

  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const validFiles: File[] = [];

    newFiles.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`El archivo ${file.name} excede el tamaño máximo de 10MB`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      validFiles.push(file);
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !comment.trim()) {
      toast.error("El asunto y comentario son requeridos", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!isAdmin && files.length === 0) {
      toast.error("Debe adjuntar al menos un archivo como usuario", {
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

      if (isAdmin) {
        await createAdminCommentMutation.mutateAsync({
          requestId: request.Id,
          payload,
        });
      } else {
        await replyWithFilesMutation.mutateAsync({
          requestId: request.Id,
          payload,
          files,
        });
      }

      toast.success("Comentario enviado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });

      setSubject("");
      setComment("");
      setFiles([]);
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

  const handleViewFolder = () => {
    folderLinkMutation.mutate(request.Id);
  };

  // Preparar lista de documentos adjuntos
  const documents = [];
  
  if (request.IdCardFiles && request.IdCardFiles.length > 0) {
    request.IdCardFiles.forEach((file, idx) => {
      documents.push({ name: `Cédula ${idx + 1}`, path: file, type: 'IdCard' });
    });
  }
  
  if (request.PlanoPrintFiles && request.PlanoPrintFiles.length > 0) {
    request.PlanoPrintFiles.forEach((file, idx) => {
      documents.push({ name: `Plano Catastrado ${idx + 1}`, path: file, type: 'PlanoPrint' });
    });
  }
  
  if (request.LiteralCertificateFile) {
    documents.push({ name: 'Certificado Literal', path: request.LiteralCertificateFile, type: 'LiteralCertificate' });
  }
  
  if (request.RequestLetterFile) {
    documents.push({ name: 'Carta de Solicitud', path: request.RequestLetterFile, type: 'RequestLetter' });
  }
  
  if (request.ConstructionPermitFile) {
    documents.push({ name: 'Permiso de Construcción', path: request.ConstructionPermitFile, type: 'ConstructionPermit' });
  }

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
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Correo Electrónico</span>
              <p className="text-gray-900 font-medium truncate" title={request.User?.Email}>{request.User?.Email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Teléfono</span>
              <p className="text-gray-900 font-medium truncate" title={request.User?.PhoneNumber}>{request.User?.PhoneNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-1">Dirección</span>
              <p className="text-gray-900 font-medium truncate" title={request.User?.Address}>{request.User?.Address}</p>
            </div>
            {request.Justification && (
              <div className="md:col-span-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <span className="text-xs text-blue-700 uppercase tracking-wide font-semibold block mb-2">Justificación</span>
                <p className="text-gray-900 leading-relaxed break-words">{request.Justification}</p>
              </div>
            )}
          </div>

          {/* Documentos originales */}
          {documents.length > 0 && (
            <div className="mt-6">
              <h5 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Documentos Adjuntos a la Solicitud
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate" title={doc.name}>{doc.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{doc.type}</p>
                        <button
                          onClick={handleViewFolder}
                          disabled={folderLinkMutation.isPending}
                          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                          {folderLinkMutation.isPending ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Cargando...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                              Ver Carpeta
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                placeholder={isAdmin ? "Escriba su observación o solicitud de documentos..." : "Escriba su respuesta y adjunte los documentos solicitados..."}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                disabled={isSubmitting}
              />
            </div>

            {!isAdmin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Documentos Adjuntos (Requerido)</label>
                <label className="flex items-center justify-center gap-3 px-4 py-6 border-2 border-dashed border-gray-400 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                  <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-700">Haga clic para seleccionar archivos</span>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (máx. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="bg-blue-100 p-2 rounded">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={isSubmitting}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !comment.trim() || (!isAdmin && files.length === 0)}
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
                    {isAdmin ? "Enviar Comentario" : "Enviar Respuesta"}
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
