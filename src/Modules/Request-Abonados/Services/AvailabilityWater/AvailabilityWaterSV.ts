import apiAxios from "../../../../api/apiConfig";
import type { AvailabilityWater, PartialAvailabilityWater } from "../../Models/AvailabilityWater/AvailabilityWater";


export async function createAvailabilityWaterRq(payloads: PartialAvailabilityWater) : Promise<AvailabilityWater> {
    try {
        const { data: response } = await apiAxios.post<AvailabilityWater>("/request-availability-water", payloads);
        return response;
    } catch (error) {
        throw new Error(`Error creating availability water request: ${error}`);
    }
}

