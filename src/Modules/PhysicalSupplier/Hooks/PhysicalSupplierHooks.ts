import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPhysicalSupplier, deletePhysicalSupplier, editPhysicalSupplier, getAllPhysicalSupplier, getPhysicalSuppliers } from "../Services/PhysicalSupplier";
import { toast } from "sonner";
import type {
    PhysicalSupplier,
    PhysicalSupplierPaginationParams,
    UpdatePhysicalSupplierDto,
} from "../Models/PhysicalSupplier";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

export const useCreatePhysicalSupplier = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['phySupplier'],
        mutationFn: createPhysicalSupplier,
        onSuccess: (res) => {
            console.log(res);
            qc.invalidateQueries({queryKey: ['phySupplier']});
            toast.success('Proveedor físico creado con éxito', {duration: 3000, position: 'top-right'});
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al crear el Proveedor', {duration: 3000, position: 'top-right'});
        }
    })
    return mutation;
}


export const useSearchPhysicalSupplier = (params: PhysicalSupplierPaginationParams) => {
    const query = useQuery<PaginatedResponse<PhysicalSupplier>, Error>({
        queryKey: ["phySupplier", "search", params],
        queryFn: () => getAllPhysicalSupplier(params),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });

    useEffect(() => {
        if (query.data) {
            const res = query.data;
            console.log(
                "[phySupplier fetched]",
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


export const useEditPhysicalSupplier= () =>{
    const qc = useQueryClient();

    const mutation = useMutation<PhysicalSupplier, Error, {id: number; data: UpdatePhysicalSupplierDto }>({
        mutationFn: ({id, data}) => editPhysicalSupplier(id, data),
        onSuccess :(res)=>{
            console.log('proveedor actualizado', res)
            qc.invalidateQueries({queryKey: [`phySupplier`]})
            toast.success('Proveedor actualizado con éxito ', {position: 'top-right', duration: 3000})
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al actualizar proveedor', {position: 'top-right', duration: 3000})
        }
    })

    return mutation;
}


export const useDeletePhysicalSupplier = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deletePhysicalSupplier(id),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: ["phySupplier"] });
            console.log("Proveedor físico inhabilitado", res);
        },
        onError: (err)=>{
            console.error("Error al inhabilitar", err);
        }
    });
};

export const useGetAllPhysicalSuppliers = () =>{
    const { data: phySup, isPending, error } = useQuery({
        queryKey: ["phySupplier"],
        queryFn: getPhysicalSuppliers,
    });
    return { phySup, isPending, error };
}