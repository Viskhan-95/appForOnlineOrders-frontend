import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { RootStackParamList } from "../../App";

type NavigationProp = {
    navigate: (screen: keyof RootStackParamList, params?: unknown) => void;
    goBack: () => void;
    canGoBack: () => boolean;
    reset: (state: unknown) => void;
    push: (screen: keyof RootStackParamList, params?: unknown) => void;
    pop: (count?: number) => void;
    popToTop: () => void;
};

/**
 * Универсальный хук для навигации в приложении
 */
export const useAppNavigation = () => {
    const navigation = useNavigation<NavigationProp>();

    // Базовые методы навигации
    const navigate = useCallback(
        (screen: keyof RootStackParamList, params?: unknown) => {
            navigation.navigate(screen, params);
        },
        [navigation]
    );

    const goBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [navigation]);

    const push = useCallback(
        (screen: keyof RootStackParamList, params?: unknown) => {
            navigation.push(screen, params);
        },
        [navigation]
    );

    const pop = useCallback(
        (count?: number) => {
            navigation.pop(count);
        },
        [navigation]
    );

    const popToTop = useCallback(() => {
        navigation.popToTop();
    }, [navigation]);

    // Специализированные методы навигации
    const goToLogin = useCallback(() => {
        navigation.navigate("Auth");
    }, [navigation]);

    const goToRegister = useCallback(() => {
        navigation.navigate("Register");
    }, [navigation]);

    // const goToForgotPassword = useCallback(() => {
    //     navigation.navigate("ForgotPassword");
    // }, [navigation]);

    // const goToHome = useCallback(() => {
    //     navigation.navigate("Home");
    // }, [navigation]);

    // Методы сброса навигации
    const resetToLogin = useCallback(() => {
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    }, [navigation]);

    const resetToHome = useCallback(() => {
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
        });
    }, [navigation]);

    const reset = useCallback(
        (state: unknown) => {
            navigation.reset(state as any);
        },
        [navigation]
    );

    return {
        // Базовые методы
        navigate,
        goBack,
        push,
        pop,
        popToTop,
        reset,

        // Специализированные методы
        goToLogin,
        goToRegister,
        // goToForgotPassword,
        // goToHome,

        // Методы сброса
        resetToLogin,
        resetToHome,

        // Утилиты
        canGoBack: navigation.canGoBack,
    };
};
