import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import WelcomeAnimatedScreen from "./WelcomeAnimatedScreen";

const HomeScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const [isAppLoading, setIsAppLoading] = useState(true);

    const handleLogout = () => {
        logout();
    };

    const handleLoadingComplete = () => {
        setIsAppLoading(false);
    };

    // Имитация загрузки данных с сервера
    useEffect(() => {
        const loadData = async () => {
            try {
                // Здесь можно добавить загрузку данных с сервера
                // await fetchUserData();
                // await fetchRestaurants();
                // await fetchMenuItems();

                // Минимальная задержка для демонстрации
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        loadData();
    }, []);

    if (isAppLoading) {
        return <WelcomeAnimatedScreen onLoadingComplete={handleLoadingComplete} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Добро пожаловать!</Text>

            {user && (
                <View style={styles.userInfo}>
                    <Text style={styles.label}>Пользователь: {user.email}</Text>
                    <Text style={styles.label}>Роль: {user.role}</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Выйти</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#111015",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 30,
    },
    userInfo: {
        marginBottom: 30,
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        color: "#FFFFFF",
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: "#FF0000",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    logoutText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default HomeScreen;
