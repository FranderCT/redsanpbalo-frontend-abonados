import apiAxios from "../../../api/apiConfig";
import type { Comment, NewComment } from "../Models/Comment";

const BASE = "/comment"; 

export async function getAllComments(): Promise<Comment[]> {
    const res = await apiAxios.get<Comment[]>(BASE);
    return res.data;
}

// export async function searchComments(
//     params: ProductPaginationParams
//     ): Promise<PaginatedResponse<Product>> {
//     try {
//         const { page = 1, limit = 10, name, categoryId, materialId, unitId, state } = params ?? {};
//         const { data } = await apiAxios.get<PaginatedResponse<Product>>(`${BASE}/search`, {
//         params: { page, limit, name, categoryId, materialId, unitId, state },
//         });
//         return data;
//     } catch (err) {
//         console.error("Error buscando productos", err);
//         return Promise.reject(err);
//     }
// }

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