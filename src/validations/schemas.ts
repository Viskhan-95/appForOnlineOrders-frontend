import { z } from "zod";
import {
    emailSchema,
    passwordSchema,
    phoneSchema,
    nameSchema,
    loginSchema as baseLoginSchema,
    forgotPasswordSchema as baseForgotPasswordSchema,
} from "./baseSchemas";

// Схема для регистрации
export const registerSchema = z.object({
    firstName: nameSchema.regex(
        /^[а-яёА-ЯЁ\s-]+$/,
        "Имя может содержать только русские буквы, пробелы и дефисы"
    ),

    lastName: nameSchema.regex(
        /^[а-яёА-ЯЁ\s-]+$/,
        "Фамилия может содержать только русские буквы, пробелы и дефисы"
    ),

    phone: phoneSchema.regex(
        /^\+?[0-9\s\-\(\)]{11,12}$/,
        "Введите корректный номер телефона"
    ),

    email: emailSchema.toLowerCase(),

    password: passwordSchema.regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру"
    ),

    city: z.string(),

    street: z.string(),

    house: z.string(),

    apartment: z.string().optional(),

    role: z.string().optional(),
});

// Схема для входа
export const loginSchema = baseLoginSchema;

// Схема для восстановления пароля
export const forgotPasswordSchema = baseForgotPasswordSchema;

// Схема для сброса пароля
export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, "Пароль должен содержать минимум 6 символов")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру"
            ),

        confirmPassword: z.string().min(1, "Подтвердите пароль"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

// Типы для TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
