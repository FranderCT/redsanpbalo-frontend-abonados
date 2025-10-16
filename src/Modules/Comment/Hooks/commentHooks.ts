import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getAllComments, getCommentById, updateComment } from "../Services/commentServices";

export const useCreateComment = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createComment,
        onSuccess: (res) =>{
            console.log('comentario creado', res);
            qc.invalidateQueries({queryKey: ['comments']})
        },
        onError: (err) =>{
            console.log("error al crear", err)
        }
    })
    return mutation;
}

export const useUpdateComment = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: updateComment,
        onSuccess: (res) =>{
            console.log('comentario creado', res);
            qc.invalidateQueries({queryKey: ['comments']})
        },
        onError: (err) =>{
            console.log("error al crear", err)
        }
    })
    return mutation;
}

export const useGetAllComments = () =>{
    const { data: comments, isPending, error } = useQuery({
        queryKey: ["comments"],
        queryFn: getAllComments,
    });
    return { comments, isPending, error };
}

export const useGetCommentById = (id: number) => {
    const {data: comment, isLoading,error} = useQuery({
        queryKey: ["comments", id],
        queryFn: () => getCommentById(id),
    });

    return { comment, isLoading, error };
};