// src/Modules/DashboardPrincipal-Admin/Hooks/dashboardHooks.ts
import { useQuery } from '@tanstack/react-query'
import { getApprovedRequests, getMonthlyAllRequests, getPendingRequests } from '../Services/dashboardService'

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

const shortMonth = (m: number) =>
  ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][m - 1];

export const useMonthlyAllRequests = (opts?: {
  months?: number;
}) => {
  const months = opts?.months ?? 12;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard','requests','monthly', months],
    queryFn: () => getMonthlyAllRequests({ months }),
    staleTime: 60_000,
  });

  // Etiqueta inteligente:
  // - Si NO cruza años: solo mes (Ene, Feb...)
  // - Si cruza años: muestra el año solo en enero; vacío en otros meses
  const points = data ?? [];
  const years = new Set(points.map(p => p.year));
  const crossesYears = years.size > 1;

  const chartData = points.map(p => ({
    name: crossesYears ? `${shortMonth(p.month)} ${String(p.year).slice(2)}` : shortMonth(p.month),
    value: p.count,
  }));

  return { data: points, chartData, isLoading, isError, error };
};