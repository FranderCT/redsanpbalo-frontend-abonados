// src/Modules/DashboardPrincipal-Admin/Hooks/dashboardHooks.ts
import { useQuery } from '@tanstack/react-query'
import { getPendingRequests } from '../Services/dashboardService'

export const useGetAllReqPendingsDashboard = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['dashboard','reqavailwater','changeMeters'],
    queryFn: getPendingRequests,
  })

  return { data, error, isPending }
}
