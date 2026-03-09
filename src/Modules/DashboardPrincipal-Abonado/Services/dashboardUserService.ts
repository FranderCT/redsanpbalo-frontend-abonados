import apiAxios from "../../../api/apiConfig";

export type MyRequestsSummary = {
  total: number;
  pending: number;
  approved: number;
  byType: {
    availability: number;
    supervision: number;
    changeMeter: number;
    changeName: number;
    associated: number;
  };
};

export type MonthlyPoint = { year: number; month: number; count: number };

const BASE = "/dashboard";

export async function getMyRequestsSummary(): Promise<MyRequestsSummary> {
  try {
    const { data } = await apiAxios.get<MyRequestsSummary>(`${BASE}/me/requests/count`);
    return data;
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

