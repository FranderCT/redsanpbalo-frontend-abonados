import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { CreateReportPayload, UpdateReportPayload, Report, ReportPaginationParams } from "../Models/Report";

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



export async function createReportByAdmin(payload: CreateReportPayload): Promise<Report> {
    try {
        const { data } = await apiAxios.post<Report>(`${BASE_URL}/admin`, payload);
        return data;
    } catch (error) {
        console.error("Error creating report:", error);
        throw error;
    }
}


export async function createReportByUser(payload: CreateReportPayload): Promise<Report> {
    try {
        const { data } = await apiAxios.post<Report>(`${BASE_URL}`, payload);
        return data;
    } catch (error) {
        console.error("Error creating report:", error);
        throw error;
    }       
}

export async function assignUserInCharge(reportId: string, userInChargeId: number): Promise<Report> {
    try {
        const { data } = await apiAxios.patch<Report>(`${BASE_URL}/${reportId}/assign-user-in-charge`, {
            userInChargeId
        });
        return data;
    } catch (error) {
        console.error("Error assigning user in charge:", error);
        throw error;
    }
}

export async function updateReport(reportId: string, payload: UpdateReportPayload): Promise<Report> {
    try {
        const { data } = await apiAxios.patch<Report>(`${BASE_URL}/${reportId}`, payload);
        return data;
    } catch (error) {
        console.error("Error updating report:", error);
        throw error;
    }
}