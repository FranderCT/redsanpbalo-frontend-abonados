// Hooks/CommentRequestHooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createCommentRequest,
  deleteCommentRequest,
  getAllCommentRequests,
  getCommentRequestById,
  updateCommentRequest,
} from "../Services/CommentRequestServices";
import type {
  CommentRequest,
  newCommentRequest,
  UpdateCommentRequest,
} from "../Models/CommentRequest";

// Lista
export const useGetAllCommentRequests = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["comment-request"],
    queryFn: getAllCommentRequests,
    staleTime: 30_000,
  });
  return { comments: data ?? [], isPending, error };
};

// Detalle
export const useGetCommentRequestById = (id?: number) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["comment-request", id],
    queryFn: () => getCommentRequestById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
  return { comment: data, isPending, error };
};

// Crear
export const useCreateCommentRequest = () => {
  const qc = useQueryClient();
  return useMutation<CommentRequest, Error, newCommentRequest>({
    mutationFn: createCommentRequest,
    onSuccess: (res) => {
      console.log("Comentario creado", res);
      qc.invalidateQueries({ queryKey: ["comment-request"] });
    },
  });
};

// Actualizar
export const useUpdateCommentRequest = () => {
  const qc = useQueryClient();
  return useMutation<CommentRequest, Error, { id: number; data: UpdateCommentRequest }>({
    mutationFn: ({ id, data }) => updateCommentRequest(id, data),
    onSuccess: (res) => {
      console.log("Comentario actualizado", res);
      qc.invalidateQueries({ queryKey: ["comment-request"] });
      qc.invalidateQueries({ queryKey: ["comment-request", res.Id] });
    },
    onError: (err) => console.error("Error actualizando comentario", err),
  });
};

// Eliminar
export const useDeleteCommentRequest = () => {
  const qc = useQueryClient();
  return useMutation<{ deleted: number } | void, Error, number>({
    mutationFn: (id) => deleteCommentRequest(id),
    onSuccess: (res) => {
      console.log("Comentario eliminado", res);
      qc.invalidateQueries({ queryKey: ["comment-request"] });
    },
    onError: (err) => console.error("Error eliminando comentario", err),
  });
};
