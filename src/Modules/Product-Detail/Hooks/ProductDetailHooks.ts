import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProductDetail } from "../Services/ProductDetailServices";

export const useCreateProductDetail = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey : ['product-detail'],
        mutationFn : createProductDetail,
        onSuccess : (res) =>{
            console.log(res);
            qc.invalidateQueries({queryKey: ['product-detail']})
            qc.invalidateQueries({queryKey: ['actual-expense']})
            qc.invalidateQueries({queryKey: ['project-trace']})
            qc.invalidateQueries({queryKey: ['project-traces']})
            qc.invalidateQueries({queryKey: ['project']})
            qc.invalidateQueries({queryKey: ['total-actual-expense']})
        },
        onError : (err) =>{
            console.error(err)
        }
    })
    return mutation;
}
