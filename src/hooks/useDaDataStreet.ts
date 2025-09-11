import { useEffect, useMemo, useState } from "react";
import { suggestStreet, type StreetOption } from "../services/dadata";
import { LruCache, createDebouncedAbortableFetcher } from "../utils/network";

const cache = new LruCache<string, StreetOption[]>(150, 10 * 60 * 1000);

export function useDaDataStreet(
    parentFiasId?: string,
    parentKind?: "city" | "settlement"
) {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<StreetOption[]>([]);
    const [loading, setLoading] = useState(false);

    const fetcher = useMemo(
        () =>
            createDebouncedAbortableFetcher<
                [q: string, pId?: string, pKind?: "city" | "settlement"],
                StreetOption[]
            >(async (signal, q, pId, pKind) => {
                if (!pId) return [];
                const key = `street:${pId}:${q}`;
                const cached = cache.get(key);
                if (cached) return cached;
                const res = await suggestStreet(
                    q,
                    { fiasId: pId, kind: (pKind ?? "city") as any },
                    signal
                );
                cache.set(key, res);
                return res;
            }, 300),
        []
    );

    useEffect(() => {
        const q = query.trim();
        if (!parentFiasId || q.length < 3) {
            setOptions([]);
            return;
        }
        setLoading(true);
        fetcher(q, parentFiasId, parentKind)
            .then(setOptions)
            .catch(() => setOptions([]))
            .finally(() => setLoading(false));
    }, [query, parentFiasId, parentKind, fetcher]);

    return { query, setQuery, options, setOptions, loading } as const;
}
