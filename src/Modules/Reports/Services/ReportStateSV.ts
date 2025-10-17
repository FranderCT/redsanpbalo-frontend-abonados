import apiAxios from "../../../api/apiConfig";
import type { ReportState } from "../Models/ReportState";

const BASE_URL = '/report-states';

export async function getAllReportStates() : Promise<ReportState[]>{
    try{
        const {data} = await apiAxios.get<ReportState[]>(`${BASE_URL}`);
        return data;
    }catch(error){
        console.error("Error fetching report states:", error);
        throw error;
    }
}
