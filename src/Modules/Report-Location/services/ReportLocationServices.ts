import apiAxios from "@/api/apiConfig";
import type { CreateReportLocationDTO, ReportLocation } from "../models/ReportLocation";

const base = 'report-location';

export async function createReportLocation (dto : CreateReportLocationDTO ) : Promise<ReportLocation> {
    const {data} = await apiAxios.post<ReportLocation>(`${base}`, dto);
    return data;
} 

export async function getReportLocations () : Promise<ReportLocation[]> {
    const {data} = await apiAxios.get<ReportLocation[]>(`${base}`);
    return data;
}

export async function updateReportLocation ( id : number, dto : Partial<CreateReportLocationDTO> ) : Promise<ReportLocation> {
    const {data} = await apiAxios.put<ReportLocation>(`${base}/${id}`, dto);
    return data;
}