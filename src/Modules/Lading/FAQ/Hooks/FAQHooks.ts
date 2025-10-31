import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFAQ, getAllFAQs, getFAQById, updateFAQ } from "../Services/FAQServices";
import type { FAQ, update_FAQ } from "../Models/FAQ";

export const useGetAllFAQs  = () => {
    const { data: faqs, isPending, error } = useQuery({
        queryKey: ["faqs"],
        queryFn: getAllFAQs,
    });
    return { faqs, isPending, error };
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