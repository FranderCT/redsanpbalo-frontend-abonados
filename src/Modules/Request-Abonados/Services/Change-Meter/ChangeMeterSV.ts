import apiAxios from "../../../../api/apiConfig";
import type { ChangeMeter, PartialChangeMeter } from "../../Models/Change-Meter/ChangeMeter";

const BASE = "/request-change-meter";

export async function createChangeMeterRequest(payloads : PartialChangeMeter) : Promise<ChangeMeter> {
    try{
        const {data} = await apiAxios.post<ChangeMeter>(`${BASE}`, payloads);
        return data;
    } catch (error) {
        throw error;
    }
}