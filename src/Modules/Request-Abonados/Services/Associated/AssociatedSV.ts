import apiAxios from "../../../../api/apiConfig";
import type { Associated, PartialAssociated } from "../../Models/Associated/Associated";

const BASE = '/request-associated';

export async function createAssociatedRequest (payloads: PartialAssociated) : Promise<Associated> {
   try{
    const {data} = await apiAxios.post<Associated>(`${BASE}`, payloads);
    return data;
   } catch (error) {
       throw new Error(`Error creating associated request: ${error}`);
   }
}