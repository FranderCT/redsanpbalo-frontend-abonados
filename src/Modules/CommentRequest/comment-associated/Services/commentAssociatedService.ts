import apiAxios from "../../../../api/apiConfig";
import type { CommentAssociated, CommentAssociatedWithFiles, CreateCommentAssociatedDto } from "../Models/commentAssociated";


const BASE = "/comment-Request-Associated";

/**
 * ADMIN: Crear comentario sin archivos
 */
export async function createAdminComment(
  requestId: number,
  payload: CreateCommentAssociatedDto
): Promise<CommentAssociated> {
  try {
    const { data } = await apiAxios.post<CommentAssociated>(
      `${BASE}/admin/${requestId}`,
      payload
    );
    return data;
  } catch (err) {
    console.error("Error creando comentario admin", err);
    return Promise.reject(err);
  }
}

/**
 * VER: Obtener todos los comentarios de una solicitud
 */
export async function getCommentsByRequestId(
  requestId: number
): Promise<CommentAssociated[]> {
  try {
    const { data } = await apiAxios.get<CommentAssociated[]>(
      `${BASE}/by-request/${requestId}`
    );
    return data;
  } catch (err) {
    console.error("Error obteniendo comentarios", err);
    return Promise.reject(err);
  }
}

/**
 * Obtener todos los comentarios
 */
export async function getAllComments(): Promise<CommentAssociated[]> {
  try {
    const { data } = await apiAxios.get<CommentAssociated[]>(`${BASE}/All`);
    return data;
  } catch (err) {
    console.error("Error obteniendo todos los comentarios", err);
    return Promise.reject(err);
  }
}

/**
 * USUARIO: Responder con archivos
 */
export async function replyWithFiles(
  requestId: number,
  payload: CreateCommentAssociatedDto,
  files: File[]
): Promise<CommentAssociatedWithFiles> {
  try {
    const formData = new FormData();
    
    // Agregar los campos del DTO
    formData.append('Subject', payload.Subject);
    formData.append('Comment', payload.Comment);
    
    // Agregar los archivos
    files.forEach((file) => {
      formData.append('files', file);
    });

    const { data } = await apiAxios.post<CommentAssociatedWithFiles>(
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
    console.error("Error enviando respuesta con archivos", err);
    return Promise.reject(err);
  }
}