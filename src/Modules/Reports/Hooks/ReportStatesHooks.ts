import { useQuery } from "@tanstack/react-query"
import { getAllReportStates } from "../Services/ReportStateSV"


export const useGetAllReportStates = () => {
    const {data: reportStates, error, isLoading} = useQuery({
        queryKey: ['reportStates'],
        queryFn: getAllReportStates
    })
    return {reportStates, error, isLoading}
}
