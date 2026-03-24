import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProductDetail } from "../Services/ProductDetailServices";
import { projectKeys } from "../../Project/queryKeys";

export const useCreateProductDetail = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey : [...projectKeys.all, "product-detail"],
        mutationFn : createProductDetail,
        onSuccess : (res) =>{
            console.log(res);
            qc.invalidateQueries({queryKey: projectKeys.all})
        },
        onError : (err) =>{
            console.error(err)
        }
    })
    return mutation;
}
