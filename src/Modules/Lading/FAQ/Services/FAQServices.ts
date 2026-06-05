import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import type { FAQ, FAQPaginationParams, new_FAQ, update_FAQ } from "../Models/FAQ";

const BASE = "/faq"; 

type LegacyFaqMeta = {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

type LegacyFaqResponse = {
    data: FAQ[];
    meta: LegacyFaqMeta;
};

type FAQListResponse = FAQ[] | Pick<LegacyFaqResponse, "data">;

export async function getAllFAQs(): Promise<FAQ[]> {
    try{
        const {data} = await apiAxios.get<FAQListResponse>(BASE)
        if (Array.isArray(data)) return data;
        return Array.isArray(data.data) ? data.data : [];
    }catch(err){
        console.error("Error", err);
        return Promise.reject(err)
    }
}

export async function searchFAQs(
    params: FAQPaginationParams
): Promise<PaginatedResponse<FAQ>> {
    try {
        const { page = 1, limit = 10, question, state } = params ?? {};
        const { data } = await apiAxios.get<LegacyFaqResponse>(`${BASE}/search`, {
        params: { page, limit, question, state },
        });
        return {
            data: data.data,
            meta: {
                limit: data.meta.limit,
                page: data.meta.page,
                total: data.meta.total,
                pageCount: data.meta.pageCount,
                hasNextPage: data.meta.hasNextPage,
                hasPrevPage: data.meta.hasPrevPage,
            },
        };
    } catch (err) {
        console.error("Error buscando FAQs", err);
        return Promise.reject(err);
    }
}

export async function getFAQById(id: number): Promise<FAQ> {
    const res = await apiAxios.get<FAQ>(`${BASE}/${id}`);
    return res.data;
}

export async function createFAQ(payload: new_FAQ): Promise<FAQ> {
    try{
        const {data} = await apiAxios.post<FAQ>(BASE, payload);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }
}

export async function updateFAQ(id: number, payload: update_FAQ): Promise<FAQ> {
    try{
        const {data} = await apiAxios.put<FAQ>(`${BASE}/${id}`, payload)
        return data;
    }catch(err){
        console.log('Error descondico',err)
        return Promise.reject(err)
    }
}

export async function deleteFAQ(id: number): Promise<FAQ | void> {
    try{
        const {data} = await apiAxios.delete<FAQ>(`${BASE}/${id}`);
        return data;
    } catch (error) {
        console.error("Error al eliminar la FAQ", error);
    }
}
