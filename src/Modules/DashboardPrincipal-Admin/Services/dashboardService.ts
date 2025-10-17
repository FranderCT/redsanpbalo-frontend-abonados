// src/Modules/DashboardPrincipal-Admin/Services/dashboardService.ts
import apiAxios from '../../../api/apiConfig'

export type DashboardResponse = { totalPendingRequests: number }

const BASE = '/dashboard'

export const getPendingRequests = async (): Promise<DashboardResponse> => {
  const { data } = await apiAxios.get<DashboardResponse>(`${BASE}/pending-requests`)
  return data
}
