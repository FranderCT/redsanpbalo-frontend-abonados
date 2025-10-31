import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createService, getAllServices, getServiceById, updateService } from "../Servicios/Services.services";
import type { Service, update_Service } from "../Models/Services";

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