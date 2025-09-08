import apiAxios from "../../../api/apiConfig";
import type { Unit } from "../Models/unit";

export async function createUnitMeasure(payloads: Unit) : Promise<Unit>{
    try{
        const {data} = await apiAxios.post<Unit>(`unit-measure`, payloads);
        return data;
    }catch(err){
        console.log(err);
        return Promise.reject(err);
    }
}