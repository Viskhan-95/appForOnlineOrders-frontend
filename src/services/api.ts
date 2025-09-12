import { AxiosInstance, AxiosResponse } from "axios";
import { baseApiClient } from "./axiosConfig";
import { store } from "../store";

// API клиент с интерцепторами
const apiClient: AxiosInstance = baseApiClient;

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
                    const response = await axios.post(
                        `${API_URL}/auth/refresh`,
                        {
                            refreshToken,
                        }
                    );

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

        return Promise.reject(error);
    }
);

export default apiClient;
