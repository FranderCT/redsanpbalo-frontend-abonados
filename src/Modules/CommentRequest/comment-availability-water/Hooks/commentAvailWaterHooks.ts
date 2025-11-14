import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateAdminCommentDto, ReplyWithFilesDto } from "../Models/commentAvailWater";
import { createAdminComment, getAllComments, getCommentsByRequestId, replyWithFiles } from "../Services/commentAvailWaterServices";


/**
 * Hook para crear comentario de admin (sin archivos)
 */
export const useCreateAdminCommentAvailabilityWater = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      requestId, 
      payload 
    }: { 
      requestId: number; 
      payload: CreateAdminCommentDto 
    }) => createAdminComment(requestId, payload),
    
    onSuccess: (data, variables) => {
      console.log('Comentario admin creado (Availability Water)', data);
      // Invalida los comentarios de esa solicitud específica
      qc.invalidateQueries({ 
        queryKey: ['comments-availability-water', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments-availability-water', 'all'] });
    },
    
    onError: (err) => {
      console.error("Error al crear comentario admin (Availability Water)", err);
    }
  });
};

/**
 * Hook para obtener comentarios de una solicitud
 */
export const useGetCommentsByRequestIdAvailabilityWater = (requestId: number) => {
  const { data: comments, isPending, error, refetch } = useQuery({
    queryKey: ['comments-availability-water', 'by-request', requestId],
    queryFn: () => getCommentsByRequestId(requestId),
    enabled: !!requestId, // Solo ejecutar si requestId existe
  });

  return { comments, isPending, error, refetch };
};

/**
 * Hook para obtener todos los comentarios
 */
export const useGetAllCommentsAvailabilityWater = () => {
  const { data: comments, isPending, error } = useQuery({
    queryKey: ['comments-availability-water', 'all'],
    queryFn: getAllComments,
  });

  return { comments, isPending, error };
};

/**
 * Hook para responder con archivos (usuario)
 */
export const useReplyWithFilesAvailabilityWater = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      requestId, 
      payload, 
      files 
    }: { 
      requestId: number; 
      payload: ReplyWithFilesDto;
      files: File[];
    }) => replyWithFiles(requestId, payload, files),
    
    onSuccess: (data, variables) => {
      console.log('Respuesta con archivos enviada (Availability Water)', data);
      // Invalida los comentarios de esa solicitud
      qc.invalidateQueries({ 
        queryKey: ['comments-availability-water', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments-availability-water', 'all'] });
      // También invalida los archivos de la solicitud
      qc.invalidateQueries({ 
        queryKey: ['request-availability-water-files', variables.requestId] 
      });
    },
    
    onError: (err) => {
      console.error("Error al enviar respuesta con archivos (Availability Water)", err);
    }
  });
};