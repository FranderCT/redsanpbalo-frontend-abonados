import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createAgentSupplier, deleteAgentSupplier, editAgentSupplier } from "../Services/SupplierAgentServices";
import type { AgentSupppliers, newAgentSupppliers } from "../Models/SupplierAgent";

const BASE_KEY = 'agent-suppplier';

export const useCreateAgentSupplier = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['agent-suppplier'],
        mutationFn: createAgentSupplier,
        onSuccess: (res) => {
            console.log(res);
            qc.invalidateQueries({queryKey: [`${BASE_KEY}`]});
            toast.success('Proveedor físico creado con éxito', {autoClose: 3000, position: 'top-right'});
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al crear el Proveedor', {autoClose: 3000, position: 'top-right'});
        }
    })
    return mutation;
}

export const useEditAgentSupplier= () =>{
    const qc = useQueryClient();

    const mutation = useMutation<AgentSupppliers, Error, {id: number; data: newAgentSupppliers }>({
        mutationFn: ({id, data}) => editAgentSupplier(id, data),
        onSuccess :(res)=>{
            console.log('proveedor actualizado', console.log(res))
            qc.invalidateQueries({queryKey: [`${BASE_KEY}`]});
            toast.success('Proveedor actualizado con éxito ', {position: 'top-right', autoClose: 3000})
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al actualizar proveedor', {position: 'top-right', autoClose: 3000})
        }
    })

    return mutation;
}


export const useDeleteAgentSupplier = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteAgentSupplier(id),
        onSuccess: (res) => {
            qc.invalidateQueries({queryKey: [`${BASE_KEY}`]});
            console.log("Producto inhabilitado", res);
        },
        onError: (err)=>{
            console.error("Error al inhabilitar", err);
        }
    });
};