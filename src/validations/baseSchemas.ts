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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-+=])[A-Za-z\d@$!%*?&_\-+=]/,
        "Пароль должен содержать: строчные и заглавные буквы, цифры и специальные символы (@$!%*?&_-+=)"
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
    password: passwordSchema,
});

// Схема для сброса пароля (только email)
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

// Схема для сброса пароля с новым паролем
export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Подтвердите пароль"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

// Типы для TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
