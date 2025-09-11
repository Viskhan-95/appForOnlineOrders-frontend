import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
    loginUser,
    registerUser,
    registerStart,
    registerVerify,
    logoutUser,
    refreshToken,
    getMe,
    restoreSession,
    clearError,
    clearAuth,
} from "../store/slices/authSlice";
import {
    LoginRequest,
    RegisterRequest,
    RegisterStartRequest,
    RegisterVerifyRequest,
    ResetPasswordRequest,
    ResetVerifyRequest,
    ResetConfirmRequest,
} from "../types/auth";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);

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

    // Сброс пароля
    const requestPasswordReset = useCallback(
        (data: ResetPasswordRequest) => {
            // TODO: Создать отдельные thunks для сброса пароля
            return dispatch(registerStart({ email: data.email }));
        },
        [dispatch]
    );

    const verifyResetCode = useCallback(
        (data: ResetVerifyRequest) => {
            // TODO: Создать отдельные thunks для сброса пароля
            return dispatch(registerStart({ email: data.email }));
        },
        [dispatch]
    );

    const confirmPasswordReset = useCallback(
        (data: ResetConfirmRequest) => {
            // TODO: Создать отдельные thunks для сброса пароля
            return dispatch(registerStart({ email: "" })); // Временное решение
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

        // Сброс пароля
        requestPasswordReset,
        verifyResetCode,
        confirmPasswordReset,

        // Управление токенами
        refreshAuthToken,
        fetchUserData,
        restoreAuthSession,

        // Утилиты
        clearAuthError,
        clearAuthState,

        // Проверки ролей
        hasRole,
        isAdmin,
        isSuperAdmin,
        canAccessAdmin,
        canAccessSuperAdmin,
    };
};

export default useAuth;
