import { baseApiClient } from "./axiosConfig";
import {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    RegisterStartRequest,
    RegisterVerifyRequest,
    ResendCodeRequest,
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
        const response = await baseApiClient.post("/auth/login", credentials);
        return response.data;
    }

    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await baseApiClient.post("/auth/register", data);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    // Пошаговая регистрация
    async registerStart(
        data: RegisterStartRequest
    ): Promise<ApiMessageResponse> {
        const response = await baseApiClient.post("/auth/register-start", data);
        return response.data;
    }

    async registerVerify(data: RegisterVerifyRequest): Promise<AuthResponse> {
        const response = await baseApiClient.post(
            "/auth/register-verify",
            data
        );
        return response.data;
    }

    async resendVerificationCode(
        data: ResendCodeRequest
    ): Promise<ApiMessageResponse> {
        const response = await baseApiClient.post("/auth/resend-code", data);
        return response.data;
    }

    // Обновление токенов
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await baseApiClient.post("/auth/refresh", {
            refreshToken,
        });
        return response.data;
    }

    // Информация о пользователе
    async getMe(): Promise<User> {
        const response = await baseApiClient.get("/auth/me");
        return response.data;
    }

    // Выход
    async logout(): Promise<void> {
        await baseApiClient.post("/auth/logout");
    }

    // Сброс пароля
    async requestPasswordReset(
        data: ResetPasswordRequest
    ): Promise<ApiMessageResponse> {
        const response = await baseApiClient.post("/auth/request-reset", data);
        return response.data;
    }

    async verifyResetCode(
        data: ResetVerifyRequest
    ): Promise<ResetTokenResponse> {
        const response = await baseApiClient.post("/auth/reset-verify", data);
        return response.data;
    }

    async confirmPasswordReset(
        data: ResetConfirmRequest
    ): Promise<ApiMessageResponse> {
        const response = await baseApiClient.post("/auth/reset-confirm", data);
        return response.data;
    }
}

// Экспортируем singleton instance
export const authService = new AuthService();
export default authService;
