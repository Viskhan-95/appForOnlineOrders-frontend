import { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { baseApiClient } from "./axiosConfig";
import { store } from "../store";
import ErrorService from "./errorService";
import RetryService from "./retryService";

// API клиент с интерцепторами
const apiClient: AxiosInstance = baseApiClient;

// Добавляем retry interceptor
const retryInterceptor = RetryService.createRetryInterceptor({
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    onRetry: (attempt, error) => {
        if (__DEV__) {
            console.log(`🔄 Retrying API request (attempt ${attempt}):`, {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
            });
        }
    },
});

apiClient.interceptors.response.use(
    retryInterceptor.onFulfilled,
    retryInterceptor.onRejected
);

// Интерцептор для автоматического добавления токена
apiClient.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const accessToken = state.auth.tokens?.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и это не повторный запрос
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const state = store.getState();
                const refreshToken = state.auth.tokens?.refreshToken;

                if (refreshToken) {
                    // Пытаемся обновить токен
                    const response = await baseApiClient.post("/auth/refresh", {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } =
                        response.data;

                    // Обновляем токены в store
                    store.dispatch({
                        type: "auth/refreshToken/fulfilled",
                        payload: response.data,
                    });

                    // Повторяем оригинальный запрос с новым токеном
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Если обновление токена не удалось, выходим из системы
                store.dispatch({ type: "auth/logout/fulfilled" });
            }
        }

        // Логируем ошибку для разработки
        ErrorService.logError(error, "API Response Interceptor");

        // Обрабатываем ошибку через централизованный сервис
        const processedError = ErrorService.handleApiError(error);

        return Promise.reject(processedError);
    }
);

export default apiClient;
