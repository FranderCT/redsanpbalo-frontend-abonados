// src/Modules/DashboardPrincipal-Admin/Services/dashboardService.ts
import apiAxios from '../../../api/apiConfig'
import type { ApprovedDashboardResponse, MonthlyPoint, PendingDashboardResponse } from '../Models/dashboard'

const BASE = '/dashboard'

export const getPendingRequests = async (): Promise<PendingDashboardResponse> => {
  const { data } = await apiAxios.get<PendingDashboardResponse>(`${BASE}/pending-requests`)
  return data
}

export const getApprovedRequests = async (): Promise<ApprovedDashboardResponse> => {
  const { data } = await apiAxios.get<ApprovedDashboardResponse>(`${BASE}/approved-requests`)
  return data
}

export async function getMonthlyReports(params?: {
  months?: number;
  state?: string;        // ej: 'En Proceso'
  locationId?: number;
  reportTypeId?: number;
}): Promise<MonthlyPoint[]> {
  const { months = 12, state, locationId, reportTypeId } = params ?? {};
  const search = new URLSearchParams();
  search.set('months', String(months));
  if (state) search.set('state', state);
  if (locationId) search.set('locationId', String(locationId));
  if (reportTypeId) search.set('reportTypeId', String(reportTypeId));

  const { data } = await apiAxios.get<MonthlyPoint[]>(`/reports/stats/monthly?${search.toString()}`);
  return data ?? [];
}

export async function getMonthlyAllRequests(params?: {
  months?: number;
}): Promise<MonthlyPoint[]> {
  const months = params?.months ?? 12;
  const { data } = await apiAxios.get<MonthlyPoint[]>(`${BASE}/requests/monthly?months=${months}`);
  return data ?? [];
}
