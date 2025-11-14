import apiAxios from "../../../../api/apiConfig";
import type { 
  CommentSupervisionMeter, 
  CreateCommentSupervisionMeterDto 
} from "../Models/commentSupervisionMeter";

const BASE = "/comment-supervision-meter";

/**
 * ADMIN: Crear comentario sin archivos
 */
export async function createAdminComment(
  requestId: number,
  payload: CreateCommentSupervisionMeterDto
): Promise<CommentSupervisionMeter> {
  try {
    const { data } = await apiAxios.post<CommentSupervisionMeter>(
      `${BASE}/admin/${requestId}`,
      payload
    );
    return data;
  } catch (err) {
    console.error("Error creando comentario admin (Supervision Meter)", err);
    return Promise.reject(err);
  }
}

/**
 * VER: Obtener todos los comentarios de una solicitud
 */
export async function getCommentsByRequestId(
  requestId: number
): Promise<CommentSupervisionMeter[]> {
  try {
    const { data } = await apiAxios.get<CommentSupervisionMeter[]>(
      `${BASE}/by-request/${requestId}`
    );
    return data;
  } catch (err) {
    console.error("Error obteniendo comentarios (Supervision Meter)", err);
    return Promise.reject(err);
  }
}

/**
 * Obtener todos los comentarios
 */
export async function getAllComments(): Promise<CommentSupervisionMeter[]> {
  try {
    const { data } = await apiAxios.get<CommentSupervisionMeter[]>(`${BASE}/All`);
    return data;
  } catch (err) {
    console.error("Error obteniendo todos los comentarios (Supervision Meter)", err);
    return Promise.reject(err);
  }
}