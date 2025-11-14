import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentAssociatedDto } from "../Models/commentAssociated";
import { createAdminComment, getAllComments, getCommentsByRequestId, replyWithFiles } from "../Services/commentAssociatedService";


/**
 * Hook para crear comentario de admin (sin archivos)
 */
export const useCreateAdminComment = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      requestId, 
      payload 
    }: { 
      requestId: number; 
      payload: CreateCommentAssociatedDto 
    }) => createAdminComment(requestId, payload),
    
    onSuccess: (data, variables) => {
      console.log('Comentario admin creado', data);
      // Invalida los comentarios de esa solicitud específica
      qc.invalidateQueries({ 
        queryKey: ['comments', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments', 'all'] });
    },
    
    onError: (err) => {
      console.error("Error al crear comentario admin", err);
    }
  });
};

/**
 * Hook para obtener comentarios de una solicitud
 */
export const useGetCommentsByRequestId = (requestId: number) => {
  const { data: comments, isPending, error, refetch } = useQuery({
    queryKey: ['comments', 'by-request', requestId],
    queryFn: () => getCommentsByRequestId(requestId),
    enabled: !!requestId, // Solo ejecutar si requestId existe
  });

  return { comments, isPending, error, refetch };
};

/**
 * Hook para obtener todos los comentarios
 */
export const useGetAllComments = () => {
  const { data: comments, isPending, error } = useQuery({
    queryKey: ['comments', 'all'],
    queryFn: getAllComments,
  });

  return { comments, isPending, error };
};

/**
 * Hook para responder con archivos (usuario)
 */
export const useReplyWithFiles = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      requestId, 
      payload, 
      files 
    }: { 
      requestId: number; 
      payload: CreateCommentAssociatedDto;
      files: File[];
    }) => replyWithFiles(requestId, payload, files),
    
    onSuccess: (data, variables) => {
      console.log('Respuesta con archivos enviada', data);
      // Invalida los comentarios de esa solicitud
      qc.invalidateQueries({ 
        queryKey: ['comments', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments', 'all'] });
      // También invalida los archivos de la solicitud si tienes ese query
      qc.invalidateQueries({ 
        queryKey: ['request-files', variables.requestId] 
      });
    },
    
    onError: (err) => {
      console.error("Error al enviar respuesta con archivos", err);
    }
  });
};