import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { NewUnit, Unit, UnitPaginationParams, UpdateUnitDto } from "../Models/unit";

export async function createUnitMeasure(payload: NewUnit): Promise<NewUnit> {
  try {
    const { data } = await apiAxios.post<NewUnit>("unit-measure", payload);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function updateUnitMeasure(id: number, payloads: UpdateUnitDto): Promise<Unit> {
  try {
    const { data } = await apiAxios.put<Unit>(`unit-measure/${id}`, payloads);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getAllUnitsMeasure(): Promise<Unit[]> {
  try {
    const { data } = await apiAxios.get<Unit[]>("unit-measure");
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function searchUnits(
  params: UnitPaginationParams
): Promise<PaginatedResponse<Unit>> {
  try {
    const { page = 1, limit = 10, q, state } = params ?? {};
    const { data } = await apiAxios.get<PaginatedResponse<Unit>>("unit-measure/search", {
      params: {
        page,
        limit,
        q: q?.trim() || undefined,
        state,
      },
    });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteUnitMeasure(id: number): Promise<void> {
  try {
    await apiAxios.delete(`/unit-measure/${id}`);
  } catch (error) {
    return Promise.reject(error);
  }
}
