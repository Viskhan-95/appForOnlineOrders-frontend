import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    AuthState,
    User,
    AuthTokens,
    LoginRequest,
    RegisterRequest,
    RegisterStartRequest,
    RegisterVerifyRequest,
    ResetPasswordRequest,
    ResetVerifyRequest,
    ResetConfirmRequest,
    ResendCodeRequest,
} from "../../types/auth";
import authService from "../../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Константы для хранения в AsyncStorage
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

// Начальное состояние
const initialState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    registrationCompleted: false,
    registrationStep: 1,
    forgotPassword: 1,
};

// Async Thunks - асинхронные действия

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
            return rejectWithValue(
                error.response?.data?.message || "Ошибка входа"
            );
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
            return rejectWithValue(
                error.response?.data?.message || "Ошибка регистрации"
            );
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
            return rejectWithValue(
                error.response?.data?.message || "Ошибка отправки кода"
            );
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
            return rejectWithValue(
                error.response?.data?.message || "Ошибка верификации"
            );
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
            return rejectWithValue(
                error.response?.data?.message ||
                    "Ошибка повторной отправки кода"
            );
        }
    }
);

// Обновление токена
export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { auth: AuthState };
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
            return rejectWithValue(
                error.response?.data?.message || "Ошибка обновления токена"
            );
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
            return rejectWithValue(
                error.response?.data?.message ||
                    "Ошибка получения данных пользователя"
            );
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
            return rejectWithValue(
                error.response?.data?.message || "Ошибка запроса сброса пароля"
            );
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
            return rejectWithValue(
                error.response?.data?.message || "Ошибка верификации кода"
            );
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
            return rejectWithValue(
                error.response?.data?.message || "Ошибка сброса пароля"
            );
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

// Slice - синхронные действия
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Очистка ошибок
        clearError: (state) => {
            state.error = null;
        },

        // Очистка состояния
        clearAuth: (state) => {
            state.user = null;
            state.tokens = null;
            state.isAuthenticated = false;
            state.error = null;
            state.registrationCompleted = false;
            state.registrationStep = 1;
        },

        // Сброс флага завершения регистрации
        clearRegistrationCompleted: (state) => {
            state.registrationCompleted = false;
        },

        // Управление шагами регистрации
        setRegistrationStep: (state, action: PayloadAction<number>) => {
            state.registrationStep = action.payload;
        },

        // Сброс шага регистрации
        resetRegistrationStep: (state) => {
            state.registrationStep = 1;
        },

        // Управление шагами восстановления пароля
        setForgotPassword: (state, action: PayloadAction<number>) => {
            state.forgotPassword = action.payload;
        },

        // Сброс шага восстановления пароля
        resetForgotPassword: (state) => {
            state.forgotPassword = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.tokens = {
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                };
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.tokens = {
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                };
                state.isAuthenticated = true;
                state.registrationCompleted = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Register Start
            .addCase(registerStart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerStart.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerStart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Register Verify
            .addCase(registerVerify.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerVerify.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.tokens = {
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                };
                state.isAuthenticated = true;
                state.registrationCompleted = true;
                state.error = null;
            })
            .addCase(registerVerify.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Resend Verification Code
            .addCase(resendVerificationCode.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resendVerificationCode.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(resendVerificationCode.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.tokens = null;
                state.isAuthenticated = false;
                state.error = null;
                state.isLoading = false;
            })

            // Restore Session
            .addCase(restoreSession.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user;
                    state.tokens = action.payload.tokens;
                    state.isAuthenticated = true;
                    state.registrationCompleted = false;
                    state.registrationStep = 1;
                }
                state.isLoading = false;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.registrationCompleted = false;
                state.registrationStep = 1;
            })

            // Password Reset
            .addCase(requestPasswordReset.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(requestPasswordReset.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(requestPasswordReset.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(verifyResetCode.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyResetCode.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(verifyResetCode.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(confirmPasswordReset.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(confirmPasswordReset.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(confirmPasswordReset.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearAuth,
    clearRegistrationCompleted,
    setRegistrationStep,
    resetRegistrationStep,
    setForgotPassword,
    resetForgotPassword,
} = authSlice.actions;
export default authSlice.reducer;
