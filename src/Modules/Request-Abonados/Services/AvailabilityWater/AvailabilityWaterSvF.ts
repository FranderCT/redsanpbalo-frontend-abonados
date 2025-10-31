import apiAxios from "../../../../api/apiConfig";
import type {TempLinkResponse } from "../../Models/AvailabilityWater/AvailabilityWater";


const BASE = "/request-availability-water-file";

export async function getTempLink(fileId: number): Promise<TempLinkResponse> {
    try {
        const { data } = await apiAxios.get<TempLinkResponse>(
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


// export async function getFolderTempLinks(folderPath: string): Promise<FolderTempLinksCMResponse> {
//     try {
//         const { data } = await apiAxios.post<string[]>(
//         `${BASE}/temp-links-folder`,
//         { folderPath }
//         );

//         return {
//         links: data,
//         folderPath
//         };
//     } catch (err: any) {
//         console.error("❌ Error obteniendo links de carpeta:", err);
//         console.error("URL intentada:", err?.config?.url);
//         console.error("Status:", err?.response?.status);
//         console.error("Folder Path:", folderPath);
//         return Promise.reject(err);
//     }
// }