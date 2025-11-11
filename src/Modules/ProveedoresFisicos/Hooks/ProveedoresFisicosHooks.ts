import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProveedorFisico } from "../Services/ProveedoresFisicosServices";

export const useCreateProveedorFisico = () => {
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationKey: ["proveedoresFisicos" , "create"],
        mutationFn: createProveedorFisico,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
            console.log("Proveedor Físico creado y cache invalidada");
        },
        onError: (error) => {
            console.error("Error al crear el Proveedor Físico:", error);
        }
    });

    return mutation;

}