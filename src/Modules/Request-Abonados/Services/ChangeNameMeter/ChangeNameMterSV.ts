import apiAxios from "../../../../api/apiConfig";
import type { ChangeNameMeter, PartialChangeNameMeter } from "../../Models/ChangeNameMeter/ChangeNameMeter";


export async function changeNameMeterRq(payloads: PartialChangeNameMeter) : Promise<ChangeNameMeter>{
    try {
        const { data: response } = await apiAxios.post<ChangeNameMeter>("/request-change-name-meter", payloads);
        return response;
    } catch (error) {
        throw new Error(`Error creating change name meter request: ${error}`);
    }
}