import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "@/core/pagination/pagination";
import type { CreateReportPayload, UpdateReportPayload, Report, ReportPaginationParams } from "../Models/Report";

const BASE_URL = '/reports';

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string } } }).response;
    return res?.data?.message ?? "Error al obtener los reportes";
  }
  return "Error de conexión al servidor";
}

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
    query: ReportPaginationParams
): Promise<PaginatedResponse<Report>> {
    try {
        const { page = 1, limit = 10, search, stateId, locationId, ReportTypeId } = query ?? {};
        const cleanParams: Record<string, number | string | undefined> = { page, limit };
        if (search?.trim()) cleanParams.q = search.trim();
        if (stateId !== undefined && !isNaN(stateId)) cleanParams.stateId = stateId;
        if (locationId !== undefined && !isNaN(locationId)) cleanParams.locationId = locationId;
        if (ReportTypeId !== undefined && !isNaN(ReportTypeId)) cleanParams.ReportTypeId = ReportTypeId;

        const { data } = await apiAxios.get<PaginatedResponse<Report>>(`${BASE_URL}/search`, {
            params: cleanParams,
        });
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
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