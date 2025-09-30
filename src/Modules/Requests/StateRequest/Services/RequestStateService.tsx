import apiAxios from "../../../../api/apiConfig";
import type { RequestState } from "../Model/RequestState";

const BASE = 'state-request';

export async function getAllRequestStates (): Promise <RequestState[]>{
    try{
        const res = await  apiAxios.get<RequestState[]>(`${BASE}`)
        return res.data;
    }catch(err){
        console.error(err);
        return Promise.reject(err);
    }
}