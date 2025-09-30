import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLegalSupplier, editLegalSupplier, getAllLegalSupplier } from "../Services/LegalSupplierServices";
import { toast } from "react-toastify";
import type { LegalSupplier, newLegalSupplier } from "../Models/LegalSupplier";
import type { ProductPaginationParams } from "../../Products/Models/CreateProduct";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

export const useCreateLegalSupplier = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['legal-supplier'],
        mutationFn: createLegalSupplier,
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


export const useSearchLegalSupplier = (params: ProductPaginationParams) => {
    const query = useQuery<PaginatedResponse<LegalSupplier>, Error>({
        queryKey: ["legal-supplier", "search", params],
        queryFn: () => getAllLegalSupplier(params),
        placeholderData: keepPreviousData,   // v5
        staleTime: 30_000,
    });

    // ⬇️ Log en cada fetch/refetch exitoso
    useEffect(() => {
        if (query.data) {
        const res = query.data; // res: PaginatedResponse<Category>
        console.log(
            "[legal-supplier fetched]",
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


export const useEditLegalSupplier= () =>{
    const qc = useQueryClient();

    const mutation = useMutation<LegalSupplier, Error, {id: number; data: newLegalSupplier }>({
        mutationFn: ({id, data}) => editLegalSupplier(id, data),
        onSuccess :(res)=>{
            console.log('proveedor actualizado', console.log(res))
            qc.invalidateQueries({queryKey: [`suppliers`]})
            toast.success('Proveedor actualizado con éxito ', {position: 'top-right', autoClose: 3000})
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al actualizar proveedor', {position: 'top-right', autoClose: 3000})
        }
    })

    return mutation;
}