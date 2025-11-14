import apiAxios from "../../../../api/apiConfig";
import type { 
  CommentChangeMeter, 
  CreateCommentChangeMeterDto 
} from "../Models/commentChangeMeter";

const BASE = "/comment-change-meter";

/**
 * ADMIN: Crear comentario sin archivos
 */
export async function createAdminComment(
  requestId: number,
  payload: CreateCommentChangeMeterDto
): Promise<CommentChangeMeter> {
  try {
    const { data } = await apiAxios.post<CommentChangeMeter>(
      `${BASE}/admin/${requestId}`,
      payload
    );
    return data;
  } catch (err) {
    console.error("Error creando comentario admin (Change Meter)", err);
    return Promise.reject(err);
  }
}

/**
 * VER: Obtener todos los comentarios de una solicitud
 */
export async function getCommentsByRequestId(
  requestId: number
): Promise<CommentChangeMeter[]> {
  try {
    const { data } = await apiAxios.get<CommentChangeMeter[]>(
      `${BASE}/by-request/${requestId}`
    );
    return data;
  } catch (err) {
    console.error("Error obteniendo comentarios (Change Meter)", err);
    return Promise.reject(err);
  }
}

/**
 * Obtener todos los comentarios
 */
export async function getAllComments(): Promise<CommentChangeMeter[]> {
  try {
    const { data } = await apiAxios.get<CommentChangeMeter[]>(`${BASE}/All`);
    return data;
  } catch (err) {
    console.error("Error obteniendo todos los comentarios (Change Meter)", err);
    return Promise.reject(err);
  }
}

// Función para cuando implementes respuesta con archivos
/*
export async function replyWithFiles(
  requestId: number,
  payload: CreateCommentChangeMeterDto,
  files: File[]
): Promise<CommentChangeMeterWithFiles> {
  try {
    const formData = new FormData();
    
    formData.append('Subject', payload.Subject);
    formData.append('Comment', payload.Comment);
    formData.append('UserId', payload.UserId.toString());
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    const { data } = await apiAxios.post<CommentChangeMeterWithFiles>(
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
    console.error("Error enviando respuesta con archivos (Change Meter)", err);
    return Promise.reject(err);
  }
}
*/