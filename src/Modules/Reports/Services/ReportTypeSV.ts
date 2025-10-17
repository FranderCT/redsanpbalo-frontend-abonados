import apiAxios from "../../../api/apiConfig";
import type { ReportType } from "../Models/ReportType";

const BASE_URL = '/report-types';

export async function getAllReportTypes() : Promise<ReportType[]>{
    try{
        const {data} = await apiAxios.get<ReportType[]>(`${BASE_URL}`);
        return data;
    }catch(error){
        console.error("Error fetching report types:", error);
        throw error;
    }
}
