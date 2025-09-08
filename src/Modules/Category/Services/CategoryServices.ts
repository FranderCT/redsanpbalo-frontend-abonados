import apiAxios from "../../../api/apiConfig";
import type { Category, NewCategory } from "../Models/Category";

export async function createCategory(payloads: NewCategory) : Promise<NewCategory>{
    try{
        const {data} = await apiAxios.post<NewCategory>(`categories`, payloads);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }
}

export async function UpdateCategory (id: number, payloads: NewCategory) : Promise<Category>{
    try{
        const {data} = await apiAxios.patch<Category>(`categories/${id}`, payloads)
        return data;
    }catch(err){
        console.log('Error descondico',err)
        return Promise.reject(err)
    }
}

export async function getAllCategory () : Promise<Category[]>{
    try{
        const {data} = await apiAxios.get<Category[]>('categories')
        return data;
    }catch(err){
        console.error("Error", err);
        return Promise.reject(err)
    }
}