import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useGetCommentsByRequestIdChangeNameMeter, useCreateAdminCommentChangeNameMeter, useReplyWithFilesChangeNameMeter } from "../../../../CommentRequest/comment-change-name-meter/Hooks/commentChangeNameMeterHooks";
import type { ReqChangeNameMeter } from "../../Models/RequestChangeNameMeter";
import { useGetUserProfile } from "../../../../Users/Hooks/UsersHooks";
import { useTempCMLink } from "../../../../Request-Abonados/Hooks/ChangeNameMeter/ChangeNameMeterHookF";

interface CommentsChangeNameMeterModalProps {
  open: boolean;
  onClose: () => void;
  request: ReqChangeNameMeter;
  isAdmin?: boolean;
}

type RequestFile = {
  Id?: number;
  id?: number;
  Name?: string;
  name?: string;
  FileName?: string;
  FileType?: string;
};

export function CommentsChangeNameMeterModal({
  open,
  onClose,
  request,
  isAdmin = false,
}: CommentsChangeNameMeterModalProps) {
  const requesterFullName = [
    request.User?.Name,
    request.User?.Surname1,
    request.User?.Surname2,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const { comments = [], isPending: commentsLoading, refetch } =
    useGetCommentsByRequestIdChangeNameMeter(request.Id);
  const createAdminCommentMutation = useCreateAdminCommentChangeNameMeter();
  const replyWithFilesMutation = useReplyWithFilesChangeNameMeter();
  const { UserProfile } = useGetUserProfile();

  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const { data: tempLinkData, isLoading: isLoadingLink } = useTempCMLink(selectedFileId);

  useEffect(() => {
    if (tempLinkData?.link && selectedFileId) {
      window.open(tempLinkData.link, "_blank", "noopener,noreferrer");
      setSelectedFileId(null);
    }
  }, [tempLinkData, selectedFileId]);

  const originalFiles = (
    (request as ReqChangeNameMeter & {
      RequestChangeNameMeterFile?: RequestFile[];
      MeterChangeFiles?: RequestFile[];
    }).RequestChangeNameMeterFile ??
    (request as ReqChangeNameMeter & {
      RequestChangeNameMeterFile?: RequestFile[];
      MeterChangeFiles?: RequestFile[];
    }).MeterChangeFiles ??
    []
  ).filter(Boolean);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files);
    const validFiles: File[] = [];

    newFiles.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`El archivo ${file.name} excede el tamaño máximo de 10MB`, {
          position: "top-right",
          duration: 3000,
        });
        return;
      }
      validFiles.push(file);
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!subject.trim() || !comment.trim()) {
      toast.error("El asunto y comentario son requeridos", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    if (!isAdmin && files.length === 0) {
      toast.error("Debe adjuntar al menos un archivo como usuario", {
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
        duration: 3000,
      });

      setSubject("");
      setComment("");
      setFiles([]);
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

  const formatDate = (date: Date) =>
    new Date(date).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="flex h-[95vh] max-h-[95vh] max-w-5xl flex-col overflow-hidden rounded-none p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            Comunicación de solicitud de cambio de nombre de medidor #{request.Id}
          </DialogTitle>
          <DialogDescription>
            Revise el detalle, documentos y el historial de comentarios de la solicitud.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-white px-6 py-4 text-[#091540]">
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
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Fecha Solicitud</span>
                <p className="truncate font-medium text-gray-900" title={String(request.Date)}>
                  {String(request.Date)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Correo Electrónico</span>
                <p className="truncate font-medium text-gray-900" title={request.User?.Email || "Sin correo"}>
                  {request.User?.Email || "Sin correo"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Teléfono</span>
                <p className="truncate font-medium text-gray-900" title={request.User?.PhoneNumber || "Sin teléfono"}>
                  {request.User?.PhoneNumber || "Sin teléfono"}
                </p>
              </div>
              {request.Justification ? (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 md:col-span-3">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-blue-700">Justificación</span>
                  <p className="break-words leading-relaxed text-gray-900">{request.Justification}</p>
                </div>
              ) : null}
            </div>

            {originalFiles.length > 0 ? (
              <div className="mt-6">
                <h5 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Documentos Adjuntos a la Solicitud
                </h5>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {originalFiles.map((file, index) => {
                    const fileId = file.Id || file.id;
                    const fileName = file.FileName || file.Name || file.name || `Documento ${index + 1}`;
                    return (
                      <div
                        key={fileId ?? `${fileName}-${index}`}
                        className="group rounded-lg border-2 border-gray-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2">
                            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900" title={fileName}>
                              {fileName}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">{file.FileType || "Documento adjunto"}</p>
                            <button
                              type="button"
                              onClick={() => fileId && setSelectedFileId(fileId)}
                              disabled={!fileId || (isLoadingLink && selectedFileId === fileId)}
                              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-50"
                            >
                              {isLoadingLink && selectedFileId === fileId ? "Cargando..." : "Ver Documento"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 p-6">
            <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    UserProfile && commentUser ? UserProfile.Id === commentUser.Id : false;

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
                    <div key={commentItem.Id} className={`mb-4 flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] overflow-hidden rounded-xl shadow-md md:max-w-[70%] ${
                          isMyMessage
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            : "border-2 border-gray-200 bg-white text-gray-900"
                        }`}
                      >
                        <div className={`px-4 py-3 ${isMyMessage ? "bg-blue-600/30" : "bg-gray-50"}`}>
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                isMyMessage
                                  ? "bg-blue-800 text-white shadow-lg"
                                  : "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800"
                              }`}
                            >
                              {authorInitial}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-sm font-bold ${isMyMessage ? "text-white" : "text-gray-900"}`}>
                                {authorName}
                              </p>
                              <p className={`text-xs ${isMyMessage ? "text-blue-100" : "text-gray-500"}`}>
                                {formatDate(commentItem.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 px-4 py-4">
                          <div
                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                              isMyMessage ? "bg-blue-700 text-blue-100" : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {commentItem.Subject}
                          </div>
                          <p
                            className={`whitespace-pre-wrap break-words text-sm leading-relaxed ${
                              isMyMessage ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {commentItem.Comment}
                          </p>

                          {commentItem.hasFileUpdate ? (
                            <div className={`mt-3 border-t pt-3 ${isMyMessage ? "border-blue-500" : "border-gray-200"}`}>
                              <p className={`mb-2 flex items-center gap-1 text-xs font-medium ${isMyMessage ? "text-blue-200" : "text-gray-600"}`}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                </svg>
                                Documentos actualizados adjuntos
                              </p>
                              <div className="text-xs italic text-gray-500">
                                Los archivos actualizados se encuentran en la sección superior del chat
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex-shrink-0 border-t-2 border-gray-300 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  placeholder={isAdmin ? "Escriba su observación o solicitud de documentos..." : "Escriba su respuesta y adjunte los documentos solicitados..."}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              {!isAdmin ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Documentos Adjuntos (Requerido)</label>
                  <label className="group flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-400 px-4 py-6 transition-all hover:border-blue-500 hover:bg-blue-50">
                    <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-gray-700">Haga clic para seleccionar archivos</span>
                      <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (máx. 10MB)</p>
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

                  {files.length > 0 ? (
                    <div className="mt-3 max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                      {files.map((file, idx) => (
                        <div key={`${file.name}-${idx}`} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="rounded bg-blue-100 p-2">
                              <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900" title={file.name}>{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                            disabled={isSubmitting}
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !subject.trim() || !comment.trim() || (!isAdmin && files.length === 0)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
                >
                  {isSubmitting ? "Enviando..." : isAdmin ? "Enviar Comentario" : "Enviar Respuesta"}
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
