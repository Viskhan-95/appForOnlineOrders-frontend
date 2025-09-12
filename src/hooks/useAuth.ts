import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    loginUser,
    registerUser,
    registerStart,
    registerVerify,
    resendVerificationCode,
    logoutUser,
    refreshToken,
    getMe,
    restoreSession,
    clearError,
    clearAuth,
    clearRegistrationCompleted,
    setRegistrationStep,
    resetRegistration,
    setForgotPassword,
    resetForgotPassword,
    requestPasswordReset,
    verifyResetCode,
    confirmPasswordReset,
} from "../store/slices/authSlice";
import {
    LoginRequest,
    RegisterRequest,
    RegisterStartRequest,
    RegisterVerifyRequest,
    ResendCodeRequest,
    ResetPasswordRequest,
    ResetVerifyRequest,
    ResetConfirmRequest,
} from "../types/auth";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);

    const {
        user,
        tokens,
        isAuthenticated,
        isLoading,
        error,
        registrationCompleted,
        registration,
        forgotPassword,
    } = authState;

    // Основные методы аутентификации
    const login = useCallback(
        (credentials: LoginRequest) => {
            return dispatch(loginUser(credentials));
        },
        [dispatch]
    );

    const register = useCallback(
        (userData: RegisterRequest) => {
            return dispatch(registerUser(userData));
        },
        [dispatch]
    );

    const logout = useCallback(() => {
        return dispatch(logoutUser());
    }, [dispatch]);

    // Пошаговая регистрация
    const startRegistration = useCallback(
        (data: RegisterStartRequest) => {
            return dispatch(registerStart(data));
        },
        [dispatch]
    );

    const verifyRegistration = useCallback(
        (data: RegisterVerifyRequest) => {
            return dispatch(registerVerify(data));
        },
        [dispatch]
    );

    const resendVerificationCodeAction = useCallback(
        (data: ResendCodeRequest) => {
            return dispatch(resendVerificationCode(data));
        },
        [dispatch]
    );

    // Сброс пароля
    const requestPasswordResetAction = useCallback(
        (data: ResetPasswordRequest) => {
            return dispatch(requestPasswordReset(data));
        },
        [dispatch]
    );

    const verifyResetCodeAction = useCallback(
        (data: ResetVerifyRequest) => {
            return dispatch(verifyResetCode(data));
        },
        [dispatch]
    );

    const confirmPasswordResetAction = useCallback(
        (data: ResetConfirmRequest) => {
            return dispatch(confirmPasswordReset(data));
        },
        [dispatch]
    );

    // Управление токенами
    const refreshAuthToken = useCallback(() => {
        return dispatch(refreshToken());
    }, [dispatch]);

    const fetchUserData = useCallback(() => {
        return dispatch(getMe());
    }, [dispatch]);

    const restoreAuthSession = useCallback(() => {
        return dispatch(restoreSession());
    }, [dispatch]);

    // Утилиты
    const clearAuthError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearAuthState = useCallback(() => {
        dispatch(clearAuth());
    }, [dispatch]);

    const clearRegistrationCompletedFlag = useCallback(() => {
        dispatch(clearRegistrationCompleted());
    }, [dispatch]);

    const setStep = useCallback(
        (step: number) => {
            dispatch(setRegistrationStep(step));
        },
        [dispatch]
    );

    const resetStep = useCallback(() => {
        dispatch(resetRegistration());
    }, [dispatch]);

    // Управление шагами восстановления пароля
    const setForgotPasswordAction = useCallback(
        (step: number) => {
            dispatch(setForgotPassword(step));
        },
        [dispatch]
    );

    const resetForgotPassword = useCallback(() => {
        dispatch(resetForgotPassword());
    }, [dispatch]);

    const clearStorage = useCallback(async () => {
        try {
            await AsyncStorage.multiRemove([
                "access_token",
                "refresh_token",
                "user",
            ]);
        } catch (error) {
            console.error("Ошибка очистки хранилища:", error);
        }
    }, []);

    // Вычисляемые значения
    const isLoggedIn = authState.isAuthenticated && authState.user !== null;
    const hasTokens = authState.tokens !== null;
    const canRefresh = hasTokens && authState.tokens?.refreshToken;

    // Проверки ролей
    const hasRole = useCallback(
        (role: "SUPERADMIN" | "ADMIN" | "USER") => {
            return authState.user?.role === role;
        },
        [authState.user]
    );

    const isAdmin = hasRole("ADMIN") || hasRole("SUPERADMIN");
    const isSuperAdmin = hasRole("SUPERADMIN");

    // 🔒 Проверки доступа
    const canAccessAdmin = isAdmin;
    const canAccessSuperAdmin = isSuperAdmin;

    return {
        // Состояние
        ...authState,
        isLoggedIn,
        hasTokens,
        canRefresh,

        // Методы аутентификации
        login,
        register,
        logout,

        // Пошаговая регистрация
        startRegistration,
        verifyRegistration,
        resendVerificationCode: resendVerificationCodeAction,

        // Сброс пароля
        requestPasswordReset: requestPasswordResetAction,
        verifyResetCode: verifyResetCodeAction,
        confirmPasswordReset: confirmPasswordResetAction,

        // Управление токенами
        refreshAuthToken,
        fetchUserData,
        restoreAuthSession,

        // Утилиты
        clearAuthError,
        clearAuthState,
        clearRegistrationCompletedFlag,
        setStep,
        resetStep,
        setForgotPassword: setForgotPasswordAction,
        resetForgotPassword,
        clearStorage,

        // Проверки ролей
        hasRole,
        isAdmin,
        isSuperAdmin,
        canAccessAdmin,
        canAccessSuperAdmin,
    };
};

export default useAuth;
