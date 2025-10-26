import { useQuery } from "@tanstack/react-query"
import { getAllReportStates, getReportsInProcessCount } from "../Services/ReportStateSV"


export const useGetAllReportStates = () => {
    const {data: reportStates, error, isLoading} = useQuery({
        queryKey: ['reportStates'],
        queryFn: getAllReportStates
    })
    return {reportStates, error, isLoading}
}

export const useReportsInProcessCount = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reports", "in-process", "count"],
    queryFn: getReportsInProcessCount,
  });

  return {
    totalReportsInProcess: data ?? 0,
    isLoading,
    isError,
    error,
  };
};
