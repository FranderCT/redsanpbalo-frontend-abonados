import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { NewUnit, Unit, UnitPaginationParams, UpdateUnitDto } from "../Models/unit";

export async function createUnitMeasure(payload: NewUnit): Promise<NewUnit> {
  const { data } = await apiAxios.post<NewUnit>("unit-measure", payload);
  return data;
}

export async function updateUnitMeasure(id: number, payloads: UpdateUnitDto): Promise<Unit> {
  const { data } = await apiAxios.put<Unit>(`unit-measure/${id}`, payloads);
  return data;
}

export async function getAllUnitsMeasure(): Promise<Unit[]> {
  const { data } = await apiAxios.get<Unit[]>("unit-measure");
  return data;
}

export async function searchUnits(
  params: UnitPaginationParams
): Promise<PaginatedResponse<Unit>> {
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
}

export async function deleteUnitMeasure(id: number): Promise<void> {
  await apiAxios.delete(`/unit-measure/${id}`);
}
