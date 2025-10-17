// src/Modules/DashboardPrincipal-Admin/Hooks/dashboardHooks.ts
import { useQuery } from '@tanstack/react-query'
import { getPendingRequests } from '../Services/dashboardService'

export const useGetAllReqPendingsDashboard = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['dashboard', 'pending-requests'],
    queryFn: getPendingRequests,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000,   
  })

  return { data, error, isPending }
}
