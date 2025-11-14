import apiAxios from "../../../../api/apiConfig";
import type { CommentAvailabilityWater, CommentAvailabilityWaterWithFiles, CreateAdminCommentDto, ReplyWithFilesDto } from "../Models/commentAvailWater";


const BASE = "/comment-availability-water";

/**
 * ADMIN: Crear comentario sin archivos
 */
export async function createAdminComment(
  requestId: number,
  payload: CreateAdminCommentDto
): Promise<CommentAvailabilityWater> {
  try {
    const { data } = await apiAxios.post<CommentAvailabilityWater>(
      `${BASE}/admin/${requestId}`,
      payload
    );
    return data;
  } catch (err) {
    console.error("Error creando comentario admin (Availability Water)", err);
    return Promise.reject(err);
  }
}

/**
 * VER: Obtener todos los comentarios de una solicitud
 */
export async function getCommentsByRequestId(
  requestId: number
): Promise<CommentAvailabilityWater[]> {
  try {
    const { data } = await apiAxios.get<CommentAvailabilityWater[]>(
      `${BASE}/by-request/${requestId}`
    );
    return data;
  } catch (err) {
    console.error("Error obteniendo comentarios (Availability Water)", err);
    return Promise.reject(err);
  }
}

/**
 * Obtener todos los comentarios
 */
export async function getAllComments(): Promise<CommentAvailabilityWater[]> {
  try {
    const { data } = await apiAxios.get<CommentAvailabilityWater[]>(`${BASE}/All`);
    return data;
  } catch (err) {
    console.error("Error obteniendo todos los comentarios (Availability Water)", err);
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
): Promise<CommentAvailabilityWaterWithFiles> {
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

    const { data } = await apiAxios.post<CommentAvailabilityWaterWithFiles>(
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
    console.error("Error enviando respuesta con archivos (Availability Water)", err);
    return Promise.reject(err);
  }
}