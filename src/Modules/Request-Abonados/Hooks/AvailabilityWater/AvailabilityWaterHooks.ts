import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAvailabilityWaterRq } from "../../Services/AvailabilityWater/AvailabilityWaterSV";
import { toast } from "react-toastify";

export const useCreateAvailabilityWaterRq= () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createAvailabilityWaterRq,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['availability-water-requests'] });
            toast.success("Solicitud de disponibilidad de agua creada con éxito", { position: "top-right", autoClose: 2000 });
        },
        onError: () => {
            toast.error("Error al crear la solicitud de disponibilidad de agua", { position: "top-right", autoClose: 2000 });
        }
    });
}