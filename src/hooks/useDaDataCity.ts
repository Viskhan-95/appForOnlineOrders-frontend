import { useEffect, useRef, useState } from "react";
import { suggestCity, type CityOption } from "../services/dadata";

export function useDaDataCity() {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<CityOption[]>([]);
    const [loading, setLoading] = useState(false);

    const ctrlRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const q = query.trim();
        if (q.length < 3) {
            setOptions([]);
            return;
        }
        setLoading(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                ctrlRef.current?.abort();
                const ctrl = new AbortController();
                ctrlRef.current = ctrl;
                const res = await suggestCity(q, undefined, ctrl.signal);
                setOptions(res);
            } catch {
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            ctrlRef.current?.abort();
        };
    }, [query]);

    return { query, setQuery, options, setOptions, loading } as const;
}
