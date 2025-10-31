import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFAQ, deleteFAQ, getAllFAQs, getFAQById, searchFAQs, updateFAQ } from "../Services/FAQServices";
import type { FAQ, FAQPaginationParams, update_FAQ } from "../Models/FAQ";
import type { PaginatedResponse } from "../../../../assets/Dtos/PaginationCategory";
import { useEffect } from "react";

export const useGetAllFAQs  = () => {
    const { data: faqs, isPending, error } = useQuery({
        queryKey: ["faqs"],
        queryFn: getAllFAQs,
    });
    return { faqs, isPending, error };
};

export const useSearchFAQs = (params: FAQPaginationParams) => {
    const query = useQuery<PaginatedResponse<FAQ>, Error>({
        queryKey: ["faqs", "search", params],
        queryFn: () => searchFAQs(params),
        placeholderData: keepPreviousData,   // v5
        staleTime: 30_000,
    });

    // ⬇️ Log en cada fetch/refetch exitoso
    useEffect(() => {
        if (query.data) {
        const res = query.data; 
        console.log(
            "[FAQs fetched]",
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


// Obtener por ID
export const useGetFAQById = (id?: number) => {
    const { data: faq, isPending, error } = useQuery({
        queryKey: ["faqs", id],
        queryFn: () => getFAQById(id as number),
        enabled: typeof id === "number" && id > 0,
    });
    return { faq, isPending, error };
};

// Crear
export const useCreateFAQ = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createFAQ,
        onSuccess: (res) =>{
            console.log('FAQ creado correctamente',res)
            qc.invalidateQueries({queryKey: ['faqs']})
        },
        onError: (err) =>{
            console.error('Error al crear', err)
        }
    })

    return mutation;
};

// Actualizar
export const useUpdateFAQ = () => {
    const qc = useQueryClient();
    
    const mutation = useMutation<FAQ, Error, {id: number; data: update_FAQ }>({
        mutationFn: ({id, data}) => updateFAQ(id, data),
        onSuccess: (res) => {
            console.log('FAQ actualizado correctamente', res);
            qc.invalidateQueries({queryKey: ['faqs']});
        },
        onError: (err) => {
            console.error('Error al actualizar FAQ:', err);
        }
    });

    return mutation;
};

// Eliminar
export const useDeleteFAQ = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteFAQ(id),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: ["faqs"] });
            console.log("FAQ eliminada", res);
        },
        onError: (err)=>{
            console.error("Error al eliminar FAQ", err);
        }
    });
};