import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createSupervisionMeterRequest } from "../../Services/Supervision-Meter/SupervisionMeterSV";
import { toast } from "react-toastify";

export const useCreateSupervisionMeterRequest = () => {
    // definimos el hook para crear una solicitud de supervisión de medidor
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createSupervisionMeterRequest,
        mutationKey: ['requestsupervision-meter'],
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['requestsupervision-meter'] });
            toast.success('Solicitud de supervisión de medidor creada con éxito', {position: "top-right", autoClose: 2000});
        }, onError: (error: any) => {
            toast.error(`Error al crear la solicitud: ${error.message}`, {position: "top-right", autoClose: 2000});
        }
    });
}