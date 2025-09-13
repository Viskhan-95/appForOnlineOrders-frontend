import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    LoginRequest,
    RegisterRequest,
    RegisterStartRequest,
    RegisterVerifyRequest,
    ResendCodeRequest,
    ResetPasswordRequest,
    ResetVerifyRequest,
    ResetConfirmRequest,
} from "../../types/auth";
import authService from "../../services/authService";
import ErrorService, { ErrorDetails } from "../../services/errorService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Константы для хранения в AsyncStorage
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

// Вход в систему
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);

            // Сохраняем данные в AsyncStorage
            await AsyncStorage.multiSet([
                [ACCESS_TOKEN_KEY, response.accessToken],
                [REFRESH_TOKEN_KEY, response.refreshToken],
                [USER_KEY, JSON.stringify(response.user)],
            ]);

            return response;
        } catch (error: any) {
            // Передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Регистрация
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);

            // Сохраняем данные в AsyncStorage
            await AsyncStorage.multiSet([
                [ACCESS_TOKEN_KEY, response.accessToken],
                [REFRESH_TOKEN_KEY, response.refreshToken],
                [USER_KEY, JSON.stringify(response.user)],
            ]);

            return response;
        } catch (error: any) {
            // Передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Пошаговая регистрация - отправка кода
export const registerStart = createAsyncThunk(
    "auth/registerStart",
    async (data: RegisterStartRequest, { rejectWithValue }) => {
        try {
            const response = await authService.registerStart(data);
            return response;
        } catch (error: any) {
            // Для логина передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Пошаговая регистрация - верификация
export const registerVerify = createAsyncThunk(
    "auth/registerVerify",
    async (data: RegisterVerifyRequest, { rejectWithValue }) => {
        try {
            const response = await authService.registerVerify(data);

            // Сохраняем данные в AsyncStorage
            await AsyncStorage.multiSet([
                [ACCESS_TOKEN_KEY, response.accessToken],
                [REFRESH_TOKEN_KEY, response.refreshToken],
                [USER_KEY, JSON.stringify(response.user)],
            ]);

            return response;
        } catch (error: any) {
            // Для логина передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Повторная отправка кода подтверждения
export const resendVerificationCode = createAsyncThunk(
    "auth/resendVerificationCode",
    async (data: ResendCodeRequest, { rejectWithValue }) => {
        try {
            const response = await authService.resendVerificationCode(data);
            return response;
        } catch (error: any) {
            // Для логина передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Обновление токена
export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { auth: any };
            const refreshTokenValue = state.auth.tokens?.refreshToken;

            if (!refreshTokenValue) {
                throw new Error("Нет refresh token");
            }

            const response = await authService.refreshToken(refreshTokenValue);

            // Обновляем токены в AsyncStorage
            await AsyncStorage.multiSet([
                [ACCESS_TOKEN_KEY, response.accessToken],
                [REFRESH_TOKEN_KEY, response.refreshToken],
            ]);

            return response;
        } catch (error: any) {
            // Для логина передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Получение информации о пользователе
export const getMe = createAsyncThunk(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getMe();
            return response;
        } catch (error: any) {
            // Для логина передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Выход из системы
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();

            // Очищаем AsyncStorage
            await AsyncStorage.multiRemove([
                ACCESS_TOKEN_KEY,
                REFRESH_TOKEN_KEY,
                USER_KEY,
            ]);

            return null;
        } catch (error: any) {
            // Даже если запрос не удался, очищаем локальные данные
            await AsyncStorage.multiRemove([
                ACCESS_TOKEN_KEY,
                REFRESH_TOKEN_KEY,
                USER_KEY,
            ]);
            return null;
        }
    }
);

// Сброс пароля - запрос кода
export const requestPasswordReset = createAsyncThunk(
    "auth/requestPasswordReset",
    async (data: ResetPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await authService.requestPasswordReset(data);
            return response;
        } catch (error: any) {
            // Передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Сброс пароля - верификация кода
export const verifyResetCode = createAsyncThunk(
    "auth/verifyResetCode",
    async (data: ResetVerifyRequest, { rejectWithValue }) => {
        try {
            const response = await authService.verifyResetCode(data);
            return response;
        } catch (error: any) {
            // Передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Сброс пароля - подтверждение с токеном
export const confirmPasswordReset = createAsyncThunk(
    "auth/confirmPasswordReset",
    async (data: ResetConfirmRequest, { rejectWithValue }) => {
        try {
            const response = await authService.confirmPasswordReset(data);
            return response;
        } catch (error: any) {
            // Передаем полную ошибку для обработки в компоненте
            return rejectWithValue(error);
        }
    }
);

// Восстановление сессии при запуске приложения
export const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async (_, { rejectWithValue }) => {
        try {
            const [accessToken, refreshTokenValue, userString] =
                await AsyncStorage.multiGet([
                    ACCESS_TOKEN_KEY,
                    REFRESH_TOKEN_KEY,
                    USER_KEY,
                ]);

            if (accessToken[1] && refreshTokenValue[1] && userString[1]) {
                const user = JSON.parse(userString[1]);
                return {
                    user,
                    tokens: {
                        accessToken: accessToken[1],
                        refreshToken: refreshTokenValue[1],
                    },
                };
            }

            return null;
        } catch (error) {
            return rejectWithValue("Ошибка восстановления сессии");
        }
    }
);
