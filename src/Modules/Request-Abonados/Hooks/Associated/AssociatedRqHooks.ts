import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssociatedRequest } from "../../Services/Associated/AssociatedSV";
import { toast } from "react-toastify";

export const useCreateAssociatedRequest = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn:  createAssociatedRequest,
        mutationKey: ['associated', 'create'],
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['associated'] });
            toast.success("Solicitud de asociado creada con éxito", {position: "top-right", autoClose: 3000});
        },
        onError: (error) => {
            console.error("Error creating associated request:", error);
            toast.error("Error al crear la solicitud de asociado", {position: "top-right", autoClose: 3000});
        }
    }); 
}