import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import MainNavigator from "./MainNavigator";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import AuthScreen from "../screens/auth/AuthScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPassword from "../screens/auth/ForgotPasswordScreen";
import WelcomeAnimatedScreen from "../screens/main/WelcomeAnimatedScreen";

export type RootStackParamList = {
    Welcome: undefined;
    Auth: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    const {
        isLoggedIn,
        isLoading,
        registrationCompleted,
        registrationStep,
        forgotPassword,
    } = useAuth();

    const [isAppInitializing, setIsAppInitializing] = useState(true);

    // Показываем WelcomeAnimatedScreen только при первоначальной загрузке приложения
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAppInitializing(false);
        }, 2000); // 2 секунды для показа анимации

        return () => clearTimeout(timer);
    }, []);

    if (isAppInitializing) {
        return <WelcomeAnimatedScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn && registrationCompleted && registrationStep === 1 ? (
                // Показываем Main только если регистрация полностью завершена и шаг сброшен
                <Stack.Screen name="Main" component={MainNavigator} />
            ) : registrationStep > 1 ? (
                // Показываем RegisterScreen если пользователь в процессе регистрации
                <Stack.Screen name="Register" component={RegisterScreen} />
            ) : forgotPassword > 1 ? (
                // Показываем ForgotPasswordScreen если пользователь в процессе восстановления пароля
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                />
            ) : (
                <>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Auth" component={AuthScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPassword}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
