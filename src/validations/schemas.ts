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

    // Код подтверждения для StepFour
    verificationCode: z
        .string()
        .min(1, "Код подтверждения обязателен")
        .regex(/^\d{6}$/, "Код должен содержать 6 цифр"),
});

// Схема для входа
export const loginSchema = baseLoginSchema;

// Схемы для восстановления пароля по шагам
export const forgotPasswordStep1 = z.object({
    email: emailSchema.toLowerCase(),
});

export const forgotPasswordStep2 = z.object({
    email: emailSchema.toLowerCase(),
    code: z
        .string()
        .min(1, "Код подтверждения обязателен")
        .regex(/^\d{6}$/, "Код должен содержать 6 цифр"),
});

export const forgotPasswordStep3 = z.object({
    email: emailSchema.toLowerCase(),
    code: z
        .string()
        .min(1, "Код подтверждения обязателен")
        .regex(/^\d{6}$/, "Код должен содержать 6 цифр"),
    password: passwordSchema.regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру"
    ),
});

// Полная схема для восстановления пароля
export const forgotPassword = z.object({
    email: emailSchema.toLowerCase(),
    code: z
        .string()
        .min(1, "Код подтверждения обязателен")
        .regex(/^\d{6}$/, "Код должен содержать 6 цифр"),
    password: passwordSchema.regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру"
    ),
});

// Старая схема для совместимости
export const forgotPasswordSchema = baseForgotPasswordSchema;

// Импортируем схему сброса пароля из базовых схем
export { resetPasswordSchema } from "./baseSchemas";

// Типы для TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPassword>;
export type ForgotPasswordStep1FormData = z.infer<typeof forgotPasswordStep1>;
export type ForgotPasswordStep2FormData = z.infer<typeof forgotPasswordStep2>;
export type ForgotPasswordStep3FormData = z.infer<typeof forgotPasswordStep3>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
