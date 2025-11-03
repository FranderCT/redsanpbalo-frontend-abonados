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

export type MyReportsSummary = {
  total: number;
  inProcess: number;
};

const BASEREPORT = "/reports";

export async function getMyReportsSummary(): Promise<MyReportsSummary> {
  const { data } = await apiAxios.get<MyReportsSummary>(`${BASEREPORT}/me/count`);
  return data;
}

export async function getMyReportsCountByState(state: string): Promise<number> {
  const { data } = await apiAxios.get<{ state: string; count: number }>(
    `${BASE}/me/count-by-state`,
    { params: { state } }
  );
  return data.count;
}

