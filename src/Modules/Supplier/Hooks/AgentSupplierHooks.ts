import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAgentSupplier } from "../../Supplier_agent/Services/SupplierAgentServices";


export const useCreateAgentSupplier = () =>{
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: createAgentSupplier,
        onSuccess: (res) =>{
            console.log('Agente Creado', res),
            // Invalidate agent lists so UI updates in related places
            qc.invalidateQueries({ queryKey: ['agent-supplier'] });
            qc.invalidateQueries({ queryKey: ['legal-supplier', 'agent-supplier'] });
            qc.invalidateQueries({ queryKey: ['legal-supplier'] });
        },
        onError: (err) => {
            console.error(err)
        }
    })

    return mutation;
}