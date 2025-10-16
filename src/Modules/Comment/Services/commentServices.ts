import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { Comment, CommentPaginationParams, NewComment } from "../Models/Comment";

const BASE = "/comment"; 

export async function getAllComments(): Promise<Comment[]> {
    const res = await apiAxios.get<Comment[]>(BASE);
    return res.data;
}

export async function searchComments(
    params: CommentPaginationParams
    ): Promise<PaginatedResponse<Comment>> {
    try {
        const { page = 1, limit = 10, read } = params ?? {};
        const { data } = await apiAxios.get<PaginatedResponse<Comment>>(`${BASE}/search`, {
        params: { page, limit, read },
        });
        return data;
    } catch (err) {
        console.error("Error buscando productos", err);
        return Promise.reject(err);
    }
}

export async function createComment(payloads: NewComment) : Promise<Comment>{
    try{
        const {data} = await apiAxios.post<Comment>(BASE, payloads);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }

}

export async function getCommentById(id: number): Promise<Comment> {
    const res = await apiAxios.get<Comment>(`${BASE}/${id}`);
    return res.data;
}

export async function updateComment(id: number): Promise<Comment> {
    const res = await apiAxios.patch<Comment>(`${BASE}/${id}`);
    return res.data;
}