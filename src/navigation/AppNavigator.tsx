import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import RouteSelector from "../components/navigation/RouteSelector";
import WelcomeAnimatedScreen from "../screens/main/WelcomeAnimatedScreen";
import ErrorBoundary from "../components/error-boundaries/ErrorBoundary";

const AppNavigator: React.FC = () => {
    const { isLoading, restoreAuthSession } = useAuth();
    const [isAppInitializing, setIsAppInitializing] = useState(true);

    // Восстанавливаем сессию и показываем анимацию загрузки
    useEffect(() => {
        const initApp = async () => {
            try {
                // Восстанавливаем сессию при запуске приложения
                await restoreAuthSession();
            } catch (error) {
                console.error("Ошибка восстановления сессии:", error);
            } finally {
                // Показываем WelcomeAnimatedScreen минимум 2 секунды
                setTimeout(() => {
                    setIsAppInitializing(false);
                }, 2000);
            }
        };

        initApp();
    }, [restoreAuthSession]);

    if (isAppInitializing) {
        return (
            <ErrorBoundary context="AppInitialization">
                <WelcomeAnimatedScreen />
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary context="MainApp">
            <RouteSelector />
        </ErrorBoundary>
    );
};

export default AppNavigator;
