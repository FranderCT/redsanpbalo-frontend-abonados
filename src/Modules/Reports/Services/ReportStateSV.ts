import apiAxios from "../../../api/apiConfig";
import type { ReportState } from "../Models/ReportState";

const BASE_URL = '/report-states';

export type ReportsInProcessCount = { totalReportsInProcess: number };

export async function getAllReportStates() : Promise<ReportState[]>{
    try{
        const {data} = await apiAxios.get<ReportState[]>(`${BASE_URL}`);
        return data;
    }catch(error){
        console.error("Error fetching report states:", error);
        throw error;
    }
}

export async function getReportsInProcessCount(): Promise<number> {
  const { data } = await apiAxios.get<ReportsInProcessCount>(`${BASE_URL}/en-proceso/count`);
  return data?.totalReportsInProcess ?? 0;
}

