import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLegalSupplier, deleteLegalSupplier, editLegalSupplier, getAllLegalSupplier, getLegalSupplierById, getLegalSuppliers } from "../Services/LegalSupplierServices";
import { toast } from "sonner";
import type { LegalSupplier, newLegalSupplier } from "../Models/LegalSupplier";
import type { ProductPaginationParams } from "../../Products/Models/CreateProduct";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";
import { showApiErrorToast } from "@/core/api-error/showApiErrorToast";

export const useCreateLegalSupplier = () =>{
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createLegalSupplier,
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['legal-supplier']});
            //toast.success('Proveedor jurídico creado con éxito', {duration: 3000, position: 'top-right'});
        },
        onError: (err) =>{
            showApiErrorToast(err);
            console.error(err);
            toast.error('Error al crear el Proveedor', {duration: 3000, position: 'top-right'});
        }
    });
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
            page: res.meta.currentPage,
            limit: res.meta.itemsPerPage,
            total: res.meta.totalItems,
            pageCount: res.meta.totalPages,
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
            qc.invalidateQueries({queryKey: [`legal-supplier`]})
            toast.success('Proveedor actualizado con éxito ', {position: 'top-right', duration: 3000})
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al actualizar proveedor', {position: 'top-right', duration: 3000})
        }
    })

    return mutation;
}

export const useLegalSupplierById = (id: number) => {

  const {data: legalSup, isLoading,error} = useQuery({
    queryKey: ["legal-supplier", id, 'agent-supplier'],
    queryFn: () => getLegalSupplierById(id),
  });

  return { legalSup, isLoading, error };
};

export const useDeleteLegalSupplier = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteLegalSupplier(id),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: ["legal-supplier"] });
            console.log("Proveedor jurídico inhabilitado", res);
        },
        onError: (err)=>{
            console.error("Error al inhabilitar", err);
        }
    });
};


export const useGetAllLegalSuppliers = () =>{
    const { data: legalSup, isPending, error } = useQuery({
        queryKey: ["legal-supplier", 'agent-supplier'],
        queryFn: getLegalSuppliers,
    });
    return { legalSup, isPending, error };
}