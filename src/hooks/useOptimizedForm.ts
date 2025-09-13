import { useForm, UseFormProps, FieldValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { z } from "zod";

interface UseOptimizedFormOptions<T extends FieldValues>
    extends Omit<UseFormProps<T>, "resolver"> {
    schema: z.ZodSchema<T>;
    defaultValues: T;
}

export const useOptimizedForm = <T extends FieldValues>({
    schema,
    defaultValues,
    mode = "onChange",
    ...formOptions
}: UseOptimizedFormOptions<T>) => {
    // Мемоизируем resolver для предотвращения пересоздания
    const resolver = useMemo(() => zodResolver(schema), [schema]);

    return useForm<T>({
        ...formOptions,
        resolver,
        defaultValues,
        mode,
    });
};

// Утилита для мемоизации схем валидации
export const createMemoizedSchema = <T extends z.ZodSchema>(schema: T): T => {
    return schema;
};

// Утилита для создания мемоизированных defaultValues
export const createMemoizedDefaults = <T extends Record<string, any>>(
    defaults: T
): T => {
    return defaults;
};

export default useOptimizedForm;
