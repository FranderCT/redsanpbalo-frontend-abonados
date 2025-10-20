import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { Comment, CommentPaginationParams, NewComment, RecentCountParams, RecentCountResponse } from "../Models/Comment";

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

export async function getRecentCommentsCount(
  params?: RecentCountParams
): Promise<RecentCountResponse> {
  const { hours, days, unread } = params ?? {};
  const queryParams: Record<string, string | number | boolean> = {};

  if (typeof days === 'number') queryParams.days = days;
  else if (typeof hours === 'number') queryParams.hours = hours;

  if (typeof unread === 'boolean') queryParams.unread = unread;

  const { data } = await apiAxios.get<RecentCountResponse>(`${BASE}/recent-count`, {
    params: queryParams,
  });

  return data;
}