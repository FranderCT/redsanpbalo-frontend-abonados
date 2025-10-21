// src/Modules/DashboardPrincipal-Admin/Services/dashboardService.ts
import apiAxios from '../../../api/apiConfig'
import type { ApprovedDashboardResponse, PendingDashboardResponse } from '../Models/dashboard'

const BASE = '/dashboard'

export const getPendingRequests = async (): Promise<PendingDashboardResponse> => {
  const { data } = await apiAxios.get<PendingDashboardResponse>(`${BASE}/pending-requests`)
  return data
}

export const getApprovedRequests = async (): Promise<ApprovedDashboardResponse> => {
  const { data } = await apiAxios.get<ApprovedDashboardResponse>(`${BASE}/approved-requests`)
  return data
}
