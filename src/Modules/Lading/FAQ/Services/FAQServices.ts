import apiAxios from "../../../../api/apiConfig";
import type { FAQ, new_FAQ, update_FAQ } from "../Models/FAQ";

const BASE = "/faq"; 

export async function getAllFAQs(): Promise<FAQ[]> {
    try{
        const {data} = await apiAxios.get<FAQ[]>(BASE)
        return data;
    }catch(err){
        console.error("Error", err);
        return Promise.reject(err)
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