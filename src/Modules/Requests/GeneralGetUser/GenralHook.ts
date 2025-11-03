    import { useQuery } from "@tanstack/react-query";
    import { useEffect } from "react";
import type { AbonadoSearch } from "./Model";
import { searchAbonados } from "./GeneralService";

    export const useSearchAbonados = (searchTerm?: string) => {
    const query = useQuery<AbonadoSearch[], Error>({
        queryKey: ["users", "abonados", "search", searchTerm ?? ""],
        queryFn: () => searchAbonados(searchTerm),
        staleTime: 30_000, // Cache por 30 segundos
        refetchOnWindowFocus: false,
        // Opcional: no ejecutar si el término está vacío y quieres esperar
        // enabled: (searchTerm?.trim().length ?? 0) > 0,
    });

    useEffect(() => {
        if (query.data) {
        console.log(
            "[Abonados fetched]",
            {
            searchTerm: searchTerm ?? "todos",
            total: query.data.length,
            },
            query.data
        );
        }
    }, [query.data, searchTerm]);

    return query;
    };