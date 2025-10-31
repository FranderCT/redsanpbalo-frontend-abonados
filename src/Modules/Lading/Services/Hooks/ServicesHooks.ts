import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createService, deleteService, getAllServices, getServiceById, searchServices, updateService } from "../Servicios/Services.services";
import type { Service, ServicePaginationParams, update_Service } from "../Models/Services";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

export const useGetAllServices = () => {
    const { data: services, isPending, error } = useQuery({
        queryKey: ["services"],
        queryFn: getAllServices,
    });
    return { services, isPending, error };
};

// Obtener por ID
export const useGetServiceById = (id?: number) => {
    const { data: service, isPending, error } = useQuery({
        queryKey: ["services", id],
        queryFn: () => getServiceById(id as number),
        enabled: typeof id === "number" && id > 0,
    });
    return { service, isPending, error };
};

export const useSearchServices = (params: ServicePaginationParams) => {
    const query = useQuery<PaginatedResponse<Service>, Error>({
        queryKey: ["services", "search", params],
        queryFn: () => searchServices(params),
        placeholderData: keepPreviousData,   // v5
        staleTime: 30_000,
    });

    // ⬇️ Log en cada fetch/refetch exitoso
    useEffect(() => {
        if (query.data) {
        const res = query.data; 
        console.log(
            "[Materials fetched]",
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


// Crear
export const useCreateService = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createService,
        onSuccess: (res) =>{
            console.log('Servicio creado correctamente',res)
            qc.invalidateQueries({queryKey: ['services']})
        },
        onError: (err) =>{
            console.error('Error al crear', err)
        }
    })

    return mutation;
};

// Actualizar
export const useUpdateService = () => {
    const qc = useQueryClient();
    
    const mutation = useMutation<Service, Error, {id: number; data: update_Service }>({
        mutationFn: ({id, data}) => updateService(id, data),
        onSuccess: (res) => {
            console.log('Servicio actualizado correctamente', res);
            qc.invalidateQueries({queryKey: ['services']});
        },
        onError: (err) => {
            console.error('Error al actualizar servicio:', err);
        }
    });

    return mutation;
};

// Eliminar
export const useDeleteMaterial = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteService(id),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: ["services"] });
            console.log("Servicio eliminado", res);
        },
        onError: (err)=>{
            console.error("Error al eliminar servicio", err);
        }
    });
};