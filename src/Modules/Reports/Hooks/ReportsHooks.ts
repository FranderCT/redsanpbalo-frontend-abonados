import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { Report, ReportPaginationParams } from "../Models/Report";
import { getAllReports, searchReports, createReportByAdmin, createReportByUser, assignUserInCharge } from "../Services/ReportSV"

export const useGetAllReports = () => {
    const {data: reports, error, isLoading} = useQuery({
        queryKey: ['reports'],
        queryFn: getAllReports
    })
    return {reports, error, isLoading}
}

export const useSearchReports = (params: ReportPaginationParams) => {
    const query = useQuery<PaginatedResponse<Report>, Error>({
        queryKey: ["reports", "search", params],
        queryFn: () => searchReports(params),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });

    // Log en cada fetch/refetch exitoso
    useEffect(() => {
        if (query.data) {
            const res = query.data;
            console.log(
                "[Reports fetched]",
                {
                    page: res.meta.page,
                    limit: res.meta.limit,
                    total: res.meta.total,
                    pageCount: res.meta.pageCount,
                    params,
                },
                res.data
            );
        }
    }, [query.data, params]);

    return query;
};

export const useCreateReportByAdmin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createReportByAdmin,
        onSuccess: () => {
            console.log("Reporte creado exitosamente");
            // Invalidar las queries para refrescar la lista
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: (error) => {
            console.error("Error al crear el reporte:", error);
        }
    });
};

export const useCreateReportByUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createReportByUser,
        onSuccess: () => {
            console.log("Reporte creado exitosamente por usuario");
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: (error) => {
            console.error("Error al crear el reporte:", error);
        }
    });
};

export const useAssignUserInCharge = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ reportId, userInChargeId }: { reportId: string; userInChargeId: number }) =>
            assignUserInCharge(reportId, userInChargeId),
        onSuccess: () => {
            console.log("Usuario asignado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
        onError: (error) => {
            console.error("Error al asignar usuario:", error);
        }
    });
}; 