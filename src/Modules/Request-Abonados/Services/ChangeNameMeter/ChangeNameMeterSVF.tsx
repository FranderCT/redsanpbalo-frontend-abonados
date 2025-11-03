import apiAxios from "../../../../api/apiConfig";
import type { TempLinkCMResponse } from "../../Models/ChangeNameMeter/ChangeNameMeter";


const BASE = "/request-change-name-meter-file";
export async function getTempCNLink(fileId: number): Promise<TempLinkCMResponse> {
    try {
        const { data } = await apiAxios.get<TempLinkCMResponse>(
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
