// Services/CommentRequestServices.ts
import apiAxios from "../../../../api/apiConfig";
import type {
  CommentRequest,
  newCommentRequest,
  UpdateCommentRequest,
} from "../Models/CommentRequest";

const BASE = "/comment-request";

export async function getAllCommentRequests(): Promise<CommentRequest[]> {
  try {
    const { data } = await apiAxios.get<CommentRequest[]>(BASE);
    return data;
  } catch (err) {
    console.error("Error obteniendo comentarios", err);
    return Promise.reject(err);
  }
}

export async function getCommentRequestById(id: number): Promise<CommentRequest> {
  try {
    const { data } = await apiAxios.get<CommentRequest>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error obteniendo comentario ${id}`, err);
    return Promise.reject(err);
  }
}

export async function createCommentRequest(
  payload: newCommentRequest
): Promise<CommentRequest> {
  const body: Record<string, any> = {
    Subject: payload.Subject,
    Comment: payload.Comment,
  };
  if (payload.RequestAvailabilityWaterId) body.RequestAvailabilityWaterId = payload.RequestAvailabilityWaterId;
  if (payload.RequestSupervisionMeterId) body.RequestSupervisionMeterId = payload.RequestSupervisionMeterId;
  if (payload.RequestChangeMeterId) body.RequestChangeMeterId = payload.RequestChangeMeterId;
  if (payload.RequestChangeNameMeterId) body.RequestChangeNameMeterId = payload.RequestChangeNameMeterId;
  if (payload.RequestAssociateId) body.RequestAssociateId = payload.RequestAssociateId;

  const { data } = await apiAxios.post<CommentRequest>(BASE, body);
  return data;
}

export async function updateCommentRequest(
  id: number,
  payload: UpdateCommentRequest
): Promise<CommentRequest> {
  try {
    const { data } = await apiAxios.put<CommentRequest>(`${BASE}/${id}`, payload);
    return data;
  } catch (err) {
    console.error(`Error actualizando comentario ${id}`, err);
    return Promise.reject(err);
  }
}

export async function deleteCommentRequest(id: number): Promise<{ deleted: number } | void> {
  try {
    const { data } = await apiAxios.delete<{ deleted: number }>(`${BASE}/${id}`);
    return data;
  } catch (err) {
    console.error(`Error eliminando comentario ${id}`, err);
    return Promise.reject(err);
  }
}
