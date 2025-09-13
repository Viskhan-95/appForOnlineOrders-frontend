import React from "react";
import { useAuth } from "../../hooks/useAuth";
import MainNavigator from "../../navigation/MainNavigator";
import RegisterScreen from "../../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../../screens/auth/ForgotPasswordScreen";
import AuthNavigator from "../../navigation/AuthNavigator";

const RouteSelector: React.FC = () => {
    const {
        isLoggedIn,
        registrationCompleted,
        registrationStep,
        forgotPassword,
    } = useAuth();

    // Определяем маршрут на основе состояния аутентификации
    if (isLoggedIn && registrationCompleted && registrationStep === 1) {
        return <MainNavigator />;
    }

    if (registrationStep > 1) {
        return <RegisterScreen />;
    }

    if (forgotPassword > 1) {
        return <ForgotPasswordScreen />;
    }

    return <AuthNavigator />;
};

export default RouteSelector;
