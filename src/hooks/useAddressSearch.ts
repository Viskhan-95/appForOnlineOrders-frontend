import { useQuery } from "@tanstack/react-query";
import { searchAddress } from "../services/dadata";

export const useAddressSearch = (query: string) => {
    return useQuery({
        queryKey: ["addressSearch", query],
        queryFn: () => searchAddress(query),
        enabled: query.length >= 3,
        staleTime: 5 * 60 * 1000, // 5 минут
        cacheTime: 10 * 60 * 1000, // 10 минут
    });
};
