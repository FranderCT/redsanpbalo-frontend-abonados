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
        },
        onError : (err) =>{
            console.error(err)
        }
    })
    return mutation;
}


