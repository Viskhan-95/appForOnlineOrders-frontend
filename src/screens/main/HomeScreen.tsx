import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import WelcomeAnimatedScreen from "./WelcomeAnimatedScreen";
import { COLORS } from "../../utils/constants/colors";
import { SIZES } from "../../utils/constants/sizes";
import { rw, rh } from "../../utils/responsive";

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
        return (
            <WelcomeAnimatedScreen onLoadingComplete={handleLoadingComplete} />
        );
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
        padding: SIZES.padding.xl,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: SIZES.fontSize.xxl,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: SIZES.margin.xl,
    },
    userInfo: {
        marginBottom: SIZES.margin.xl,
        alignItems: "center",
    },
    label: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.text,
        marginBottom: SIZES.margin.sm,
    },
    logoutButton: {
        backgroundColor: COLORS.error,
        paddingHorizontal: SIZES.padding.xl,
        paddingVertical: SIZES.padding.md,
        borderRadius: SIZES.borderRadius.medium,
    },
    logoutText: {
        color: COLORS.text,
        fontSize: SIZES.fontSize.md,
        fontWeight: "bold",
    },
});

export default HomeScreen;
