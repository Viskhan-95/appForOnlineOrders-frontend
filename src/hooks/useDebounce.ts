import { useCallback, useRef, useState, useEffect } from "react";

export const useDebounce = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T => {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    ) as T;

    return debouncedCallback;
};

// Хук для дебаунса значения
export const useDebouncedValue = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
