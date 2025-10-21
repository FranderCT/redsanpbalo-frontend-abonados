// src/Modules/DashboardPrincipal-Admin/Hooks/dashboardHooks.ts
import { useQuery } from '@tanstack/react-query'
import { getApprovedRequests, getPendingRequests } from '../Services/dashboardService'

export const useGetAllReqPendingsDashboard = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['dashboard','requests','pending'],
    queryFn: getPendingRequests,
  })

  return { data, error, isPending }
}

export const useGetAllReqApprovedDashboard = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['dashboard','requests','approved'],
    queryFn: getApprovedRequests,
  })

  return { data, error, isPending }
}
