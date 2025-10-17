import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { Report, ReportPaginationParams } from "../Models/Report";

const BASE_URL = '/reports';

export async function getAllReports() : Promise<Report[]>{
    try{
        const {data} = await apiAxios.get<Report[]>(`${BASE_URL}`);
        return data;
    }catch(error){
        console.error("Error fetching reports:", error);
        throw error;
    }
}

export async function searchReports(
    params: ReportPaginationParams
): Promise<PaginatedResponse<Report>> {
    try {
        const { page = 1, limit = 10, stateId, locationId, ReportTypeId } = params ?? {};
        
        // Filtrar parámetros undefined para evitar enviar NaN al backend
        const cleanParams: Record<string, any> = { page, limit };
        
        if (stateId !== undefined && !isNaN(stateId)) {
            cleanParams.stateId = stateId;
        }
        if (locationId !== undefined && !isNaN(locationId)) {
            cleanParams.locationId = locationId;
        }
        if (ReportTypeId !== undefined && !isNaN(ReportTypeId)) {
            cleanParams.ReportTypeId = ReportTypeId;
        }
        
        const { data } = await apiAxios.get<PaginatedResponse<Report>>(`${BASE_URL}/search`, {
            params: cleanParams,
        });
        return data;
    } catch (error) {
        console.error("Error searching reports:", error);
        throw error;
    }
}

export interface CreateReportPayload {
    Location: string;
    Description: string;
    UserId: number;
    LocationId: number;
    ReportTypeId: number;
    ReportStateId: number;
    UserInChargeId?: number;
}

export async function createReportByAdmin(payload: CreateReportPayload): Promise<Report> {
    try {
        const { data } = await apiAxios.post<Report>(`${BASE_URL}/admin`, payload);
        return data;
    } catch (error) {
        console.error("Error creating report:", error);
        throw error;
    }
}
