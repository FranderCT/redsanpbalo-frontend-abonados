import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentChangeMeterDto } from "../Models/commentChangeMeter";
import { createAdminComment, getAllComments, getCommentsByRequestId } from "../Services/commentChangeMeterServices";


/**
 * Hook para crear comentario de admin (sin archivos)
 */
export const useCreateAdminCommentChangeMeter = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      requestId, 
      payload 
    }: { 
      requestId: number; 
      payload: CreateCommentChangeMeterDto 
    }) => createAdminComment(requestId, payload),
    
    onSuccess: (data, variables) => {
      console.log('Comentario admin creado (Change Meter)', data);
      // Invalida los comentarios de esa solicitud específica
      qc.invalidateQueries({ 
        queryKey: ['comments-change-meter', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments-change-meter', 'all'] });
    },
    
    onError: (err) => {
      console.error("Error al crear comentario admin (Change Meter)", err);
    }
  });
};

/**
 * Hook para obtener comentarios de una solicitud
 */
export const useGetCommentsByRequestIdChangeMeter = (requestId: number) => {
  const { data: comments, isPending, error, refetch } = useQuery({
    queryKey: ['comments-change-meter', 'by-request', requestId],
    queryFn: () => getCommentsByRequestId(requestId),
    enabled: !!requestId, // Solo ejecutar si requestId existe
  });

  return { comments, isPending, error, refetch };
};

/**
 * Hook para obtener todos los comentarios
 */
export const useGetAllCommentsChangeMeter = () => {
  const { data: comments, isPending, error } = useQuery({
    queryKey: ['comments-change-meter', 'all'],
    queryFn: getAllComments,
  });

  return { comments, isPending, error };
};

// Hook para cuando implementes respuesta con archivos
/*
export const useReplyWithFilesChangeMeter = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      requestId, 
      payload, 
      files 
    }: { 
      requestId: number; 
      payload: CreateCommentChangeMeterDto;
      files: File[];
    }) => replyWithFiles(requestId, payload, files),
    
    onSuccess: (data, variables) => {
      console.log('Respuesta con archivos enviada (Change Meter)', data);
      qc.invalidateQueries({ 
        queryKey: ['comments-change-meter', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments-change-meter', 'all'] });
      qc.invalidateQueries({ 
        queryKey: ['request-change-meter-files', variables.requestId] 
      });
    },
    
    onError: (err) => {
      console.error("Error al enviar respuesta con archivos (Change Meter)", err);
    }
  });
};
*/