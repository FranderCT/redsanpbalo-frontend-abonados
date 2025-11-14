import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { 
  CreateCommentChangeNameMeterDto,
  ReplyWithFilesDto 
} from "../Models/commentChangeNameMeter";
import { createAdminComment, getAllComments, getCommentsByRequestId, replyWithFiles } from "../Services/commentChangeNameMeterServices";


/**
 * Hook para crear comentario de admin (sin archivos)
 */
export const useCreateAdminCommentChangeNameMeter = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      requestId, 
      payload 
    }: { 
      requestId: number; 
      payload: CreateCommentChangeNameMeterDto 
    }) => createAdminComment(requestId, payload),
    
    onSuccess: (data, variables) => {
      console.log('Comentario admin creado (Change Name Meter)', data);
      // Invalida los comentarios de esa solicitud específica
      qc.invalidateQueries({ 
        queryKey: ['comments-change-name-meter', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments-change-name-meter', 'all'] });
    },
    
    onError: (err) => {
      console.error("Error al crear comentario admin (Change Name Meter)", err);
    }
  });
};

/**
 * Hook para obtener comentarios de una solicitud
 */
export const useGetCommentsByRequestIdChangeNameMeter = (requestId: number) => {
  const { data: comments, isPending, error, refetch } = useQuery({
    queryKey: ['comments-change-name-meter', 'by-request', requestId],
    queryFn: () => getCommentsByRequestId(requestId),
    enabled: !!requestId, // Solo ejecutar si requestId existe
  });

  return { comments, isPending, error, refetch };
};

/**
 * Hook para obtener todos los comentarios
 */
export const useGetAllCommentsChangeNameMeter = () => {
  const { data: comments, isPending, error } = useQuery({
    queryKey: ['comments-change-name-meter', 'all'],
    queryFn: getAllComments,
  });

  return { comments, isPending, error };
};

/**
 * Hook para responder con archivos (usuario)
 */
export const useReplyWithFilesChangeNameMeter = () => {
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
      console.log('Respuesta con archivos enviada (Change Name Meter)', data);
      // Invalida los comentarios de esa solicitud
      qc.invalidateQueries({ 
        queryKey: ['comments-change-name-meter', 'by-request', variables.requestId] 
      });
      qc.invalidateQueries({ queryKey: ['comments-change-name-meter', 'all'] });
      // También invalida los archivos de la solicitud
      qc.invalidateQueries({ 
        queryKey: ['request-change-name-meter-files', variables.requestId] 
      });
    },
    
    onError: (err) => {
      console.error("Error al enviar respuesta con archivos (Change Name Meter)", err);
    }
  });
};