import apiClient from "./api";
import {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    RegisterStartRequest,
    RegisterVerifyRequest,
    ResetPasswordRequest,
    ResetVerifyRequest,
    ResetConfirmRequest,
    User,
    ApiMessageResponse,
    ResetTokenResponse,
} from "../types/auth";

class AuthService {
    // Аутентификация
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post("/auth/login", credentials);
        return response.data;
    }

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    }

    // Пошаговая регистрация
    async registerStart(
        data: RegisterStartRequest
    ): Promise<ApiMessageResponse> {
        const response = await apiClient.post("/auth/register-start", data);
        return response.data;
    }

    async registerVerify(data: RegisterVerifyRequest): Promise<AuthResponse> {
        const response = await apiClient.post("/auth/register-verify", data);
        return response.data;
    }

    // Обновление токенов
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await apiClient.post("/auth/refresh", {
            refreshToken,
        });
        return response.data;
    }

    // Информация о пользователе
    async getMe(): Promise<User> {
        const response = await apiClient.get("/auth/me");
        return response.data;
    }

    // Выход
    async logout(): Promise<void> {
        await apiClient.post("/auth/logout");
    }

    // Сброс пароля
    async requestPasswordReset(
        data: ResetPasswordRequest
    ): Promise<ApiMessageResponse> {
        const response = await apiClient.post("/auth/request-reset", data);
        return response.data;
    }

    async verifyResetCode(
        data: ResetVerifyRequest
    ): Promise<ResetTokenResponse> {
        const response = await apiClient.post("/auth/reset-verify", data);
        return response.data;
    }

    async confirmPasswordReset(
        data: ResetConfirmRequest
    ): Promise<ApiMessageResponse> {
        const response = await apiClient.post("/auth/reset-confirm", data);
        return response.data;
    }
}

// Экспортируем singleton instance
export const authService = new AuthService();
export default authService;
