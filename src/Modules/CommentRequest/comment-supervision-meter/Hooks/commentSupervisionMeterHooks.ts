import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentSupervisionMeterDto } from "../Models/commentSupervisionMeter";
import { createAdminComment, getAllComments, getCommentsByRequestId } from "../Services/commentSupervisionMeterServices";


/**
 * Hook para crear comentario de admin (sin archivos)
 */
export const useCreateAdminCommentSupervisionMeter = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      requestId, 
      payload 
    }: { 
      requestId: number; 
      payload: CreateCommentSupervisionMeterDto 
    }) => createAdminComment(requestId, payload),
    
    onSuccess: (data, variables) => {
      console.log('Comentario admin creado (Supervision Meter)', data);
      // Invalida los comentarios de esa solicitud específica
      qc.invalidateQueries({ 
        queryKey: ['comments-supervision-meter', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments-supervision-meter', 'all'] });
    },
    
    onError: (err) => {
      console.error("Error al crear comentario admin (Supervision Meter)", err);
    }
  });
};

/**
 * Hook para obtener comentarios de una solicitud
 */
export const useGetCommentsByRequestIdSupervisionMeter = (requestId: number) => {
  const { data: comments, isPending, error, refetch } = useQuery({
    queryKey: ['comments-supervision-meter', 'by-request', requestId],
    queryFn: () => getCommentsByRequestId(requestId),
    enabled: !!requestId, // Solo ejecutar si requestId existe
  });

  return { comments, isPending, error, refetch };
};

/**
 * Hook para obtener todos los comentarios
 */
export const useGetAllCommentsSupervisionMeter = () => {
  const { data: comments, isPending, error } = useQuery({
    queryKey: ['comments-supervision-meter', 'all'],
    queryFn: getAllComments,
  });

  return { comments, isPending, error };
};