import { useQuery } from "@tanstack/react-query"
import { getAllReportTypes } from "../Services/ReportTypeSV"


export const useGetAllReportTypes = () => {
    const {data: reportTypes, error, isLoading} = useQuery({
        queryKey: ['reportTypes'],
        queryFn: getAllReportTypes
    })
    return {reportTypes, error, isLoading}
}
