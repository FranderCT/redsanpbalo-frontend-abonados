import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAgentSupplier, deleteAgentSupplier, editAgentSupplier } from "../Services/SupplierAgentServices";
import type { AgentSupppliers, newAgentSupppliers } from "../Models/SupplierAgent";

const BASE_KEY = 'agent-supplier';

export const useCreateAgentSupplier = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationKey: [BASE_KEY],
        mutationFn: createAgentSupplier,
        onSuccess: (res) => {
            console.log(res);
            qc.invalidateQueries({ queryKey: [BASE_KEY] });
            qc.invalidateQueries({ queryKey: ['legal-supplier', 'agent-supplier'] });
            qc.invalidateQueries({ queryKey: ['legal-supplier'] });
            toast.success('Agente creado con éxito', {duration: 3000, position: 'top-right'});
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al crear el Agente', {duration: 3000, position: 'top-right'});
        }
    })
    return mutation;
}

export const useEditAgentSupplier= () =>{
    const qc = useQueryClient();

    const mutation = useMutation<AgentSupppliers, Error, {id: number; data: newAgentSupppliers }>({
        mutationFn: ({id, data}) => editAgentSupplier(id, data),
        onSuccess :(res)=>{
            console.log('agente actualizado', res)
            qc.invalidateQueries({ queryKey: [BASE_KEY] });
            qc.invalidateQueries({ queryKey: ['legal-supplier', 'agent-supplier'] });
            qc.invalidateQueries({ queryKey: ['legal-supplier'] });
            toast.success('Agente actualizado con éxito ', {position: 'top-right', duration: 3000})
        },
        onError: (err) =>{
            console.error(err);
            toast.error('Error al actualizar agente', {position: 'top-right', duration: 3000})
        }
    })

    return mutation;
}


export const useDeleteAgentSupplier = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteAgentSupplier(id),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: [BASE_KEY] });
            qc.invalidateQueries({ queryKey: ['legal-supplier', 'agent-supplier'] });
            qc.invalidateQueries({ queryKey: ['legal-supplier'] });
            console.log("Agente inhabilitado", res);
        },
        onError: (err)=>{
            console.error("Error al inhabilitar", err);
        }
    });
};