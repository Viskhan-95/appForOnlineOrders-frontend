type CacheEntry<V> = { value: V; ts: number };

export class LruCache<K, V> {
    private max: number;
    private ttlMs: number;
    private map: Map<K, CacheEntry<V>>;

    constructor(max = 100, ttlMs = 10 * 60 * 1000) {
        this.max = max;
        this.ttlMs = ttlMs;
        this.map = new Map();
    }

    get(key: K): V | undefined {
        const entry = this.map.get(key);
        if (!entry) return undefined;
        if (Date.now() - entry.ts > this.ttlMs) {
            this.map.delete(key);
            return undefined;
        }
        // refresh LRU order
        this.map.delete(key);
        this.map.set(key, { value: entry.value, ts: entry.ts });
        return entry.value;
    }

    set(key: K, value: V): void {
        if (this.map.has(key)) this.map.delete(key);
        this.map.set(key, { value, ts: Date.now() });
        if (this.map.size > this.max) {
            const first = this.map.keys().next().value;
            this.map.delete(first as K);
        }
    }
}

export function createDebouncedAbortableFetcher<TArgs extends any[], TRes>(
    fn: (signal: AbortSignal, ...args: TArgs) => Promise<TRes>,
    delayMs = 300
) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let controller: AbortController | null = null;

    return function debouncedFetch(...args: TArgs): Promise<TRes> {
        if (timer) clearTimeout(timer);
        if (controller) controller.abort();
        controller = new AbortController();
        return new Promise<TRes>((resolve, reject) => {
            timer = setTimeout(async () => {
                try {
                    const result = await fn(controller!.signal, ...args);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            }, delayMs);
        });
    };
}
