import apiAxios from "../../../../api/apiConfig";
import type { TempLinkSupervisionMeterResponse } from "../../Models/Supervision-Meter/SupervisionMeter";



const BASE = "/requestsupervision-meter";
export async function getTempSPLink(fileId: number): Promise<TempLinkSupervisionMeterResponse> {
    try {
        const { data } = await apiAxios.get<TempLinkSupervisionMeterResponse>(
        `${BASE}/temp-link/${fileId}`
        );
        return data;
    } catch (err: any) {
        console.error("Error obteniendo link temporal:", err);
        console.error("URL intentada:", err?.config?.url);
        console.error("Status:", err?.response?.status);
        console.error("File ID:", fileId);
        return Promise.reject(err);
    }
}
