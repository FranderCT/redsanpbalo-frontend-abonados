import { useQuery } from "@tanstack/react-query"
import { getAllReportLocations } from "../Services/ReportLocationSV"


export const useGetAllReportLocations = () => {
    const {data: reportLocations, error, isLoading} = useQuery({
        queryKey: ['reportLocations'],
        queryFn: getAllReportLocations
    })
    return {reportLocations, error, isLoading}
}
