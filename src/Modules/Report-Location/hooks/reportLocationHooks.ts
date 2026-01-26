import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createReportLocation } from "../services/ReportLocationServices";

export const useCreateReportLocation = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['create-report-location'],
        mutationFn: createReportLocation,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['report-locations'] });
        },
        onError: (error) => {
            console.error("Error creating report location:", error);
        }
    })
    return mutation;
}