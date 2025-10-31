import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { TempLinkSupervisionMeterResponse } from "../../Models/Supervision-Meter/SupervisionMeter";
import { getTempSPLink } from "../../Services/Supervision-Meter/SupervisionMeterSvF";


export const useTempSMLink = (fileId: number | null | undefined) => {
    const query = useQuery<TempLinkSupervisionMeterResponse, Error>({
        queryKey: ["/request-change-name-meter-file", "temp-link", fileId],
        queryFn: () => getTempSPLink(fileId!),
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