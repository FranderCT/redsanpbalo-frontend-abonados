import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type {  TempLinkResponse } from "../../Models/AvailabilityWater/AvailabilityWater";
import { getTempLink } from "../../Services/AvailabilityWater/AvailabilityWaterSvF";

// Hook para un archivo individual
export const useTempLink = (fileId: number | null | undefined) => {
    const query = useQuery<TempLinkResponse, Error>({
        queryKey: ["request-availability-water-file", "temp-link", fileId],
        queryFn: () => getTempLink(fileId!),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: fileId != null && fileId > 0,
    });

    useEffect(() => {
        if (query.data) {
        console.log(
            "[Temp Link obtenido]",
            {
            fileId,
            link: query.data.link,
            expires: query.data.expires,
            },
            query.data
        );
        }
    }, [query.data, fileId]);

    return query;
};


