import { useEffect, useMemo, useState } from "react";
import { suggestCity, type CityOption } from "../services/dadata";
import { LruCache, createDebouncedAbortableFetcher } from "../utils/network";

const cache = new LruCache<string, CityOption[]>(150, 10 * 60 * 1000);

export function useDaDataCity() {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<CityOption[]>([]);
    const [loading, setLoading] = useState(false);

    const fetcher = useMemo(
        () =>
            createDebouncedAbortableFetcher<[q: string], CityOption[]>(
                async (signal, q) => {
                    const key = `city:${q}`;
                    const cached = cache.get(key);
                    if (cached) return cached;
                    const res = await suggestCity(q, undefined, signal);
                    cache.set(key, res);
                    return res;
                },
                300
            ),
        []
    );

    useEffect(() => {
        const q = query.trim();
        if (q.length < 3) {
            setOptions([]);
            return;
        }
        setLoading(true);
        fetcher(q)
            .then(setOptions)
            .catch(() => setOptions([]))
            .finally(() => setLoading(false));
    }, [query, fetcher]);

    return { query, setQuery, options, setOptions, loading } as const;
}
