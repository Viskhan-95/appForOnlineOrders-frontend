import { useEffect, useRef, useState } from "react";
import { suggestStreet, type StreetOption } from "../services/dadata";

export function useDaDataStreet(
    parentFiasId?: string,
    parentKind?: "city" | "settlement"
) {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<StreetOption[]>([]);
    const [loading, setLoading] = useState(false);

    const ctrlRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const q = query.trim();
        if (!parentFiasId || q.length < 3) {
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
                const res = await suggestStreet(
                    q,
                    {
                        fiasId: parentFiasId,
                        kind: (parentKind ?? "city") as any,
                    },
                    ctrl.signal
                );
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
    }, [query, parentFiasId, parentKind]);

    return { query, setQuery, options, setOptions, loading } as const;
}
