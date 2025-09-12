// Services/MaterialServices.ts

import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../Users/Models/Users";
import type { newSupplier, Supplier, SupplierPaginationParams, updatSupplierDto } from "../Models/Supplier";

const BASE = "/supplier"; 

export async function getAllSupplier(): Promise<Supplier[]> {
  try{
    const {data} = await apiAxios.get<Supplier[]>(BASE)
    return data;
  }catch(err){
    console.error("Error", err);
    return Promise.reject(err)
  }
}

export async function searchSuppliers(
  params: SupplierPaginationParams
): Promise<PaginatedResponse<Supplier>> {
  try {
    const { page = 1, limit = 10, name, state } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Supplier>>(`${BASE}/search`, {
      params: { page, limit, name, state },
    });
    return data;
  } catch (err) {
    console.error("Error buscando Suppliers", err);
    return Promise.reject(err);
  }
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const res = await apiAxios.get<Supplier>(`${BASE}/${id}`);
  return res.data;
}

export async function createSupplier(payload: newSupplier): Promise<newSupplier> {
  try{
    const {data} = await apiAxios.post<Supplier>(BASE, payload);
    return data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function updateSupplier(id: number, payload: updatSupplierDto): Promise<Supplier> {
  try{
    const {data} = await apiAxios.put<Supplier>(`${BASE}/${id}`, payload)
    return data;
  }catch(err){
    console.log('Error descondico',err)
    return Promise.reject(err)
  }
}

export async function deleteSupplier(id: number): Promise<void> {
  try{
    await apiAxios.delete(`${BASE}/${id}`);
  } catch (error) {
    console.error("Error al eliminar el proveedor", error);
  }
}
