import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { TempLinkCMResponse } from "../../Models/ChangeNameMeter/ChangeNameMeter";
import { getTempCNLink } from "../../Services/ChangeNameMeter/ChangeNameMeterSVF";

// Hook para un archivo individual
export const useTempCMLink = (fileId: number | null | undefined) => {
    const query = useQuery<TempLinkCMResponse, Error>({
        queryKey: ["/request-change-name-meter-file", "temp-link", fileId],
        queryFn: () => getTempCNLink(fileId!),
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