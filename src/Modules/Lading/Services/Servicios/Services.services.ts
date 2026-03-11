import apiAxios from "../../../../api/apiConfig";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
// MaterialPaginationParams removed - not used in this service module
import type { new_Service, Service, ServicePaginationParams, update_Service } from "../Models/Services";

const BASE = "/service"; 

type LegacyServiceMeta = {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

type LegacyServiceResponse = {
    data: Service[];
    meta: LegacyServiceMeta;
};

export async function getAllServices(): Promise<Service[]> {
    try{
        const {data} = await apiAxios.get<Service[]>(BASE)
        return data;
    }catch(err){
        console.error("Error", err);
        return Promise.reject(err)
    }
}

export async function searchServices(
    params: ServicePaginationParams
): Promise<PaginatedResponse<Service>> {
    try {
        const { page = 1, limit = 10, title, state } = params ?? {};
        const { data } = await apiAxios.get<LegacyServiceResponse>(`${BASE}/search`, {
        params: { page, limit, title, state },
        });
        return {
            data: data.data,
            meta: {
                totalItems: data.meta.total,
                itemCount: data.data.length,
                itemsPerPage: data.meta.limit,
                totalPages: data.meta.pageCount,
                currentPage: data.meta.page,
                hasNextPage: data.meta.hasNextPage,
                hasPrevPage: data.meta.hasPrevPage,
            },
        };
    } catch (err) {
        console.error("Error buscando Servicios", err);
        return Promise.reject(err);
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
