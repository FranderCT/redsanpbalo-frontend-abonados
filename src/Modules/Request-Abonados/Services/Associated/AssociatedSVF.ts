import apiAxios from "../../../../api/apiConfig";
import type { TempLinkAssociatedResponse } from "../../Models/Associated/Associated";

const BASE = "/request-associated-file";
export async function getTempAssociatedLink(fileId: number): Promise<TempLinkAssociatedResponse> {
    try {
        const { data } = await apiAxios.get<TempLinkAssociatedResponse>(
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