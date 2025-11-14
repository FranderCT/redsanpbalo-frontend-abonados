import apiAxios from "../../../../api/apiConfig";
import type { 
  CommentChangeNameMeter, 
  CommentChangeNameMeterWithFiles,
  CreateCommentChangeNameMeterDto,
  ReplyWithFilesDto 
} from "../Models/commentChangeNameMeter";

const BASE = "/comment-change-name-meter";

/**
 * ADMIN: Crear comentario sin archivos
 */
export async function createAdminComment(
  requestId: number,
  payload: CreateCommentChangeNameMeterDto
): Promise<CommentChangeNameMeter> {
  try {
    const { data } = await apiAxios.post<CommentChangeNameMeter>(
      `${BASE}/admin/${requestId}`,
      payload
    );
    return data;
  } catch (err) {
    console.error("Error creando comentario admin (Change Name Meter)", err);
    return Promise.reject(err);
  }
}

/**
 * VER: Obtener todos los comentarios de una solicitud
 */
export async function getCommentsByRequestId(
  requestId: number
): Promise<CommentChangeNameMeter[]> {
  try {
    const { data } = await apiAxios.get<CommentChangeNameMeter[]>(
      `${BASE}/by-request/${requestId}`
    );
    return data;
  } catch (err) {
    console.error("Error obteniendo comentarios (Change Name Meter)", err);
    return Promise.reject(err);
  }
}

/**
 * Obtener todos los comentarios
 */
export async function getAllComments(): Promise<CommentChangeNameMeter[]> {
  try {
    const { data } = await apiAxios.get<CommentChangeNameMeter[]>(`${BASE}/All`);
    return data;
  } catch (err) {
    console.error("Error obteniendo todos los comentarios (Change Name Meter)", err);
    return Promise.reject(err);
  }
}

/**
 * USUARIO: Responder con archivos
 */
export async function replyWithFiles(
  requestId: number,
  payload: ReplyWithFilesDto,
  files: File[]
): Promise<CommentChangeNameMeterWithFiles> {
  try {
    const formData = new FormData();
    
    // Agregar los campos del DTO
    formData.append('Subject', payload.Subject);
    formData.append('Comment', payload.Comment);
    formData.append('UserId', payload.UserId.toString());
    
    // Agregar los archivos
    files.forEach((file) => {
      formData.append('files', file);
    });

    const { data } = await apiAxios.post<CommentChangeNameMeterWithFiles>(
      `${BASE}/reply/${requestId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } catch (err) {
    console.error("Error enviando respuesta con archivos (Change Name Meter)", err);
    return Promise.reject(err);
  }
}