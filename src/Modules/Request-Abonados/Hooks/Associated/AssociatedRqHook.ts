import { useQuery } from "@tanstack/react-query";
import type { TempLinkAssociatedResponse } from "../../Models/Associated/Associated";
import { getTempAssociatedLink } from "../../Services/Associated/AssociatedSVF";
import { useEffect } from "react";

export const useTempLinkAssociated = (fileId: number | null | undefined) => {
    const query = useQuery<TempLinkAssociatedResponse, Error>({
        queryKey: ["/request-associated-file", "temp-link", fileId],
        queryFn: () => getTempAssociatedLink(fileId!),
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