import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getAllComments, getCommentById, getRecentCommentsCount, searchComments, updateComment } from "../Services/commentServices";
import type { Comment, CommentPaginationParams, RecentCountParams, RecentCountResponse } from "../Models/Comment";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

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

export const useSearchComments = (params: CommentPaginationParams) => {
    const query = useQuery<PaginatedResponse<Comment>, Error>({
        queryKey: ["comments", "search", params],
        queryFn: () => searchComments(params),
        placeholderData: keepPreviousData,   // v5
        staleTime: 30_000,
    });

    // ⬇️ Log en cada fetch/refetch exitoso
    useEffect(() => {
        if (query.data) {
        const res = query.data; // res: PaginatedResponse<Category>
        console.log(
            "[Comments fetched]",
            {
            page: res.meta.page,
            limit: res.meta.limit,
            total: res.meta.total,
            pageCount: res.meta.pageCount,
            params,
            },
            res.data // array de Category
        );
        }
    }, [query.data, params]);

    return query;
};

export const useRecentCommentsCount = (params?: RecentCountParams) => {
  return useQuery<RecentCountResponse>({
    queryKey: ['comments', 'recentcount', params ?? {}],
    queryFn: () => getRecentCommentsCount(params),
    staleTime: 30_000,
  });
};