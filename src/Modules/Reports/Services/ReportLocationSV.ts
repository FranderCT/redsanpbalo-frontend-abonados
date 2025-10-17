import apiAxios from "../../../api/apiConfig";
import type { ReportLocation } from "../Models/ReportLocation";

const BASE_URL = '/report-location';

export async function getAllReportLocations() : Promise<ReportLocation[]>{
    try{
        const {data} = await apiAxios.get<ReportLocation[]>(`${BASE_URL}`);
        return data;
    }catch(error){
        console.error("Error fetching report locations:", error);
        throw error;
    }
}
