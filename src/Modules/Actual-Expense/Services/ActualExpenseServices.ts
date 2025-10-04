import apiAxios from "../../../api/apiConfig";
import type { ActualExpense, NewActualExpense } from "../Models/ActualExpense";

const BASE = 'actual-expense'

export async function createActualExpense(actualExpense: NewActualExpense): Promise<ActualExpense> {
    try{
        const {data} = await apiAxios.post<ActualExpense>(`${BASE}`, actualExpense);
        return data;
    }catch(error){
        throw error;
    }
}
