import apiClient from "./api";
import ErrorService from "./errorService";
import RetryService from "./retryService";
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
        return RetryService.executeWithRetry(async () => {
            const response = await apiClient.post("/auth/login", credentials);
            return response.data;
        }, RetryService.getConfigForRequestType("critical")).catch((error) => {
            ErrorService.logError(error, "AuthService.login");
            throw ErrorService.handleApiError(error);
        });
    }

    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post("/auth/register", data);
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.register");
            throw ErrorService.handleApiError(error);
        }
    }

    // Пошаговая регистрация
    async registerStart(
        data: RegisterStartRequest
    ): Promise<ApiMessageResponse> {
        try {
            const response = await apiClient.post("/auth/register-start", data);
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.registerStart");
            throw ErrorService.handleApiError(error);
        }
    }

    async registerVerify(data: RegisterVerifyRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post(
                "/auth/register-verify",
                data
            );
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.registerVerify");
            throw ErrorService.handleApiError(error);
        }
    }

    async resendVerificationCode(
        data: ResendCodeRequest
    ): Promise<ApiMessageResponse> {
        try {
            const response = await apiClient.post("/auth/resend-code", data);
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.resendVerificationCode");
            throw ErrorService.handleApiError(error);
        }
    }

    // Обновление токенов
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        try {
            const response = await apiClient.post("/auth/refresh", {
                refreshToken,
            });
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.refreshToken");
            throw ErrorService.handleApiError(error);
        }
    }

    // Информация о пользователе
    async getMe(): Promise<User> {
        try {
            const response = await apiClient.get("/auth/me");
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.getMe");
            throw ErrorService.handleApiError(error);
        }
    }

    // Выход
    async logout(): Promise<void> {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            ErrorService.logError(error, "AuthService.logout");
            // Не бросаем ошибку для logout, так как пользователь все равно выходит
        }
    }

    // Сброс пароля
    async requestPasswordReset(
        data: ResetPasswordRequest
    ): Promise<ApiMessageResponse> {
        try {
            const response = await apiClient.post("/auth/request-reset", data);
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.requestPasswordReset");
            throw ErrorService.handleApiError(error);
        }
    }

    async verifyResetCode(
        data: ResetVerifyRequest
    ): Promise<ResetTokenResponse> {
        try {
            const response = await apiClient.post("/auth/reset-verify", data);
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.verifyResetCode");
            throw ErrorService.handleApiError(error);
        }
    }

    async confirmPasswordReset(
        data: ResetConfirmRequest
    ): Promise<ApiMessageResponse> {
        try {
            const response = await apiClient.post("/auth/reset-confirm", data);
            return response.data;
        } catch (error) {
            ErrorService.logError(error, "AuthService.confirmPasswordReset");
            throw ErrorService.handleApiError(error);
        }
    }
}

// Экспортируем singleton instance
export const authService = new AuthService();
export default authService;
