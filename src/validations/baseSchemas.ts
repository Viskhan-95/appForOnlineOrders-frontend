import { z } from "zod";

// Базовые схемы для переиспользования
export const emailSchema = z
    .string()
    .min(1, "Email обязателен")
    .email("Неверный формат email");

export const passwordSchema = z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру"
    );

export const phoneSchema = z
    .string()
    .min(1, "Телефон обязателен")
    .regex(/^\+?[1-9]\d{1,14}$/, "Неверный формат телефона");

export const nameSchema = z
    .string()
    .min(1, "Поле обязательно")
    .min(2, "Минимум 2 символа")
    .max(50, "Максимум 50 символов");

// Композитные схемы
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Пароль обязателен"),
});

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

// Типы для TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
