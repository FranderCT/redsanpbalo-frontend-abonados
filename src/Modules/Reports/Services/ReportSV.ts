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
        const { page = 1, limit = 10, q, stateId, locationId, reportTypeId, sortDir, startDate, endDate } = query ?? {};
        const cleanParams: Record<string, number | string | undefined> = { page, limit };
        if (q?.trim()) cleanParams.q = q.trim();
        if (stateId !== undefined && !isNaN(stateId)) cleanParams.stateId = stateId;
        if (locationId !== undefined && !isNaN(locationId)) cleanParams.locationId = locationId;
        if (reportTypeId !== undefined && !isNaN(reportTypeId)) cleanParams.reportTypeId = reportTypeId;
        if (sortDir === "ASC" || sortDir === "DESC") cleanParams.sortDir = sortDir;
        if (startDate?.trim()) cleanParams.startDate = startDate.trim();
        if (endDate?.trim()) cleanParams.endDate = endDate.trim();

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

/** Respuesta del endpoint de reportes por mes y ubicación */
export interface MonthlyCountByLocationRow {
  locationId: number;
  neighborhood: string;
  year: number;
  month: number;
  count: number;
}

/**
 * Obtiene la cantidad de reportes por ubicación y mes.
 * - Si se pasa year y month: estadísticas SOLO para ese mes/año.
 * - Si no: últimos `months` meses hacia atrás.
 *
 * GET /reports/stats/monthly-by-location?months=12&year=2025&month=3
 */
export async function getMonthlyCountsByLocation(opts: {
  months?: number;
  year?: number;
  month?: number;
} = {}): Promise<MonthlyCountByLocationRow[]> {
  const { months = 12, year, month } = opts;

  const params: { months?: number; year?: number; month?: number } = {};
  if (months) params.months = months;
  if (year) params.year = year;
  if (month) params.month = month;

  try {
    const { data } = await apiAxios.get<MonthlyCountByLocationRow[]>(
      `${BASE_URL}/stats/monthly-by-location`,
      { params }
    );
    return data ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}