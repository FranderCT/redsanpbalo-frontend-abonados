import apiAxios from "../../../../api/apiConfig";
import type { PartialSupervisionMeter, SupervisionMeter } from "../../Models/Supervision-Meter/SupervisionMeter";

const BASE = 'requestsupervision-meter'

export async function createSupervisionMeterRequest(payloads : PartialSupervisionMeter) : Promise<SupervisionMeter> {
    try{
        const {data} = await apiAxios.post<SupervisionMeter>(`${BASE}`, payloads);
        return data;
    } catch (error) {
        throw error;
    }
} 