import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChangeMeterRequest } from "../../Services/Change-Meter/ChangeMeterSV";
import { toast } from "react-toastify";

export const useCreateChangeMeterRequest = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createChangeMeterRequest,
        mutationKey: ['changeMeters'],
            // refresca listas donde corresponda
        onSuccess: () => {
            // refresca listas donde corresponda
            qc.invalidateQueries({ queryKey: ["changeMeters"] });
            toast.success('Solicitud de cambio de medidor creada con éxito', {position: "top-right", autoClose: 2000});
        },
        onError: (error: any) => {
            toast.error(`Error al crear la solicitud: ${error.message}`, {position: "top-right", autoClose: 2000});
        }
    });
}
