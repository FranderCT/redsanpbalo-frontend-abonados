import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAgentSupplier } from "../Service/AgentSupplier"

export const useCreateAgentSupplier = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createAgentSupplier,
        onSuccess: (res) =>{
            console.log('Agente Creado', res),
            qc.invalidateQueries({queryKey: ['products']})
        },
        onError: (err) => {
            console.error(err)
        }
    })

    return mutation;
}