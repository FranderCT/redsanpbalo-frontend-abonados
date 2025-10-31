import apiAxios from "../../../../api/apiConfig";
import type { new_Service, Service, update_Service } from "../Models/Services";

const BASE = "/service"; 

export async function getAllServices(): Promise<Service[]> {
    try{
        const {data} = await apiAxios.get<Service[]>(BASE)
        return data;
    }catch(err){
        console.error("Error", err);
        return Promise.reject(err)
    }
}

export async function getServiceById(id: number): Promise<Service> {
    const res = await apiAxios.get<Service>(`${BASE}/${id}`);
    return res.data;
}

export async function createService(payload: new_Service): Promise<Service> {
    try{
        const {data} = await apiAxios.post<Service>(BASE, payload);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }
}

export async function updateService(id: number, payload: update_Service): Promise<Service> {
    try{
        const {data} = await apiAxios.put<Service>(`${BASE}/${id}`, payload)
        return data;
    }catch(err){
        console.log('Error descondico',err)
        return Promise.reject(err)
    }
}

export async function deleteService(id: number): Promise<Service | void> {
    try{
        const {data} = await apiAxios.delete<Service>(`${BASE}/${id}`);
        return data;
    } catch (error) {
        console.error("Error al eliminar el servicio", error);
    }
}
