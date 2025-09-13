import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types/auth";
import {
    loginUser,
    registerUser,
    registerStart,
    registerVerify,
    resendVerificationCode,
    refreshToken,
    getMe,
    logoutUser,
    requestPasswordReset,
    verifyResetCode,
    confirmPasswordReset,
    restoreSession,
} from "./authThunks";

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

// Экспортируем thunks
export {
    loginUser,
    registerUser,
    registerStart,
    registerVerify,
    resendVerificationCode,
    refreshToken,
    getMe,
    logoutUser,
    requestPasswordReset,
    verifyResetCode,
    confirmPasswordReset,
    restoreSession,
};

export default authSlice.reducer;
