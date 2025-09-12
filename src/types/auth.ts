// Типы пользователя
export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: "SUPERADMIN" | "ADMIN" | "USER";
    address?: string;
    avatar?: string;
    restaurantId?: string;
    createdAt: string;
    updatedAt: string;
}

// Токены аутентификации
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

// Ответы от API
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    phone: string;
    address?: string;
    avatar?: string;
    role?: "SUPERADMIN" | "ADMIN" | "USER";
}

// Для пошаговой регистрации
export interface RegisterStartRequest {
    email: string;
}

export interface RegisterVerifyRequest {
    email: string;
    code: string;
    name: string;
    password: string;
    phone: string;
    address?: string;
    avatar?: string;
    role?: "SUPERADMIN" | "ADMIN" | "USER";
}

// Сброс пароля
export interface ResetPasswordRequest {
    email: string;
}

export interface ResetVerifyRequest {
    email: string;
    code: string;
}

export interface ResetConfirmRequest {
    resetToken: string;
    newPassword: string;
}

// Состояние аутентификации в Redux
export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    registrationCompleted: boolean;
    registrationStep: number;
}

// Ответы API с сообщениями
export interface ApiMessageResponse {
    message: string;
}

export interface ResetTokenResponse {
    resetToken: string;
}
