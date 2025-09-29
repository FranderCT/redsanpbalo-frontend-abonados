import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPhysicalSupplier } from "../Services/PhysicalSupplier";
import { toast } from "react-toastify";

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