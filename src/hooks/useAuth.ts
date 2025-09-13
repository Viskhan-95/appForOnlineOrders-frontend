import { useCallback, useMemo } from "react";
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
    resetRegistrationStep,
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

    // Мемоизированные селекторы для оптимизации производительности
    const user = useAppSelector((state) => state.auth.user);
    const tokens = useAppSelector((state) => state.auth.tokens);
    const isAuthenticated = useAppSelector(
        (state) => state.auth.isAuthenticated
    );
    const isLoading = useAppSelector((state) => state.auth.isLoading);
    const error = useAppSelector((state) => state.auth.error);
    const registrationCompleted = useAppSelector(
        (state) => state.auth.registrationCompleted
    );
    const registrationStep = useAppSelector(
        (state) => state.auth.registrationStep
    );
    const forgotPassword = useAppSelector((state) => state.auth.forgotPassword);

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

    const restoreAuthSession = useCallback(async () => {
        try {
            return await dispatch(restoreSession());
        } catch (error) {
            console.error("Ошибка восстановления сессии:", error);
            throw error;
        }
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
        dispatch(resetRegistrationStep());
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

    // Мемоизированные вычисляемые значения
    const isLoggedIn = useMemo(
        () => isAuthenticated && user !== null,
        [isAuthenticated, user]
    );

    const hasTokens = useMemo(() => tokens !== null, [tokens]);

    const canRefresh = useMemo(
        () => hasTokens && tokens?.refreshToken,
        [hasTokens, tokens?.refreshToken]
    );

    // Мемоизированные проверки ролей
    const hasRole = useCallback(
        (role: "SUPERADMIN" | "ADMIN" | "USER") => {
            return user?.role === role;
        },
        [user?.role]
    );

    const isAdmin = useMemo(
        () => hasRole("ADMIN") || hasRole("SUPERADMIN"),
        [hasRole]
    );

    const isSuperAdmin = useMemo(() => hasRole("SUPERADMIN"), [hasRole]);

    // Мемоизированные проверки доступа
    const canAccessAdmin = useMemo(() => isAdmin, [isAdmin]);
    const canAccessSuperAdmin = useMemo(() => isSuperAdmin, [isSuperAdmin]);

    // Мемоизированный возвращаемый объект
    return useMemo(
        () => ({
            // Состояние
            user,
            tokens,
            isAuthenticated,
            isLoading,
            error,
            registrationCompleted,
            registrationStep,
            forgotPassword,
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
        }),
        [
            user,
            tokens,
            isAuthenticated,
            isLoading,
            error,
            registrationCompleted,
            registrationStep,
            forgotPassword,
            isLoggedIn,
            hasTokens,
            canRefresh,
            login,
            register,
            logout,
            startRegistration,
            verifyRegistration,
            resendVerificationCodeAction,
            requestPasswordResetAction,
            verifyResetCodeAction,
            confirmPasswordResetAction,
            refreshAuthToken,
            fetchUserData,
            restoreAuthSession,
            clearAuthError,
            clearAuthState,
            clearRegistrationCompletedFlag,
            setStep,
            resetStep,
            setForgotPasswordAction,
            resetForgotPassword,
            clearStorage,
            hasRole,
            isAdmin,
            isSuperAdmin,
            canAccessAdmin,
            canAccessSuperAdmin,
        ]
    );
};

export default useAuth;
