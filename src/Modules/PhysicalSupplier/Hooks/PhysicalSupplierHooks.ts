import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPhysicalSupplier, deletePhysicalSupplier, editPhysicalSupplier, getAllPhysicalSupplier } from "../Services/PhysicalSupplier";
import { toast } from "react-toastify";
import type { ProductPaginationParams } from "../../Products/Models/CreateProduct";
import type { newPhysicalSupplier, PhysicalSupplier } from "../Models/PhysicalSupplier";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

export const useCreatePhysicalSupplier = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['physical-supplier'],
        mutationFn: createPhysicalSupplier,
        onSuccess: (res) => {
            console.log(res);
            qc.invalidateQueries({queryKey: ['physical-supplier']});
            toast.success('Proveedor físico creado con éxito', {autoClose: 3000, position: 'top-right'});
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al crear el Proveedor', {autoClose: 3000, position: 'top-right'});
        }
    })
    return mutation;
}


export const useSearchPhysicalSupplier = (params: ProductPaginationParams) => {
    const query = useQuery<PaginatedResponse<PhysicalSupplier>, Error>({
        queryKey: ["physical-supplier", "search", params],
        queryFn: () => getAllPhysicalSupplier(params),
        placeholderData: keepPreviousData,   // v5
        staleTime: 30_000,
    });

    // ⬇️ Log en cada fetch/refetch exitoso
    useEffect(() => {
        if (query.data) {
        const res = query.data; // res: PaginatedResponse<Category>
        console.log(
            "[physical-supplier fetched]",
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

    const mutation = useMutation<PhysicalSupplier, Error, {id: number; data: newPhysicalSupplier }>({
        mutationFn: ({id, data}) => editPhysicalSupplier(id, data),
        onSuccess :(res)=>{
            console.log('proveedor actualizado', console.log(res))
            qc.invalidateQueries({queryKey: [`physical-supplier`]})
            toast.success('Proveedor actualizado con éxito ', {position: 'top-right', autoClose: 3000})
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al actualizar proveedor', {position: 'top-right', autoClose: 3000})
        }
    })

    return mutation;
}


export const useDeletePhysicalSupplier = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deletePhysicalSupplier(id),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: ["products"] });
            console.log("Producto inhabilitado", res);
        },
        onError: (err)=>{
            console.error("Error al inhabilitar", err);
        }
    });
};