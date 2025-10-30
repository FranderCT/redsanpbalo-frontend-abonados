import apiAxios from "../../../api/apiConfig";
import type { AbonadoSearch } from "./Model";

    const BASE = "/users";
    export async function searchAbonados(searchTerm?: string): Promise<AbonadoSearch[]> {
    try {
        const params: Record<string, any> = {};
        
        // Solo agregar el parámetro si hay término de búsqueda
        if (searchTerm && searchTerm.trim() !== '') {
        params.q = searchTerm.trim();
        }

        const { data } = await apiAxios.get<AbonadoSearch[]>(`${BASE}/abonados/search`, {
        params,
        });

        return data;
    } catch (err: any) {
        console.error(" Error buscando abonados:", err);
        console.error("URL intentada:", err?.config?.url);
        console.error("Status:", err?.response?.status);
        return Promise.reject(err);
    }
    }