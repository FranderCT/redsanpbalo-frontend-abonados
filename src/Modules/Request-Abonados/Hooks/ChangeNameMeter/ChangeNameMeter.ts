import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createChangeMeterRequest } from "../../Services/Change-Meter/ChangeMeterSV";


export const useChangeNameMeterRq = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createChangeMeterRequest,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['change-name-meter'] });
            toast.success("Solicitud de disponibilidad de agua creada con éxito", { position: "top-right", autoClose: 2000 });
        },
        onError: () => {
            toast.error("Error al crear la solicitud de disponibilidad de agua", { position: "top-right", autoClose: 2000 });
        }
    });
}