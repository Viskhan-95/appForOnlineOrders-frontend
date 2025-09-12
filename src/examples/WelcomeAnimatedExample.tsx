import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import WelcomeAnimatedScreen from "../screens/main/WelcomeAnimatedScreen";

/**
 * Пример использования экрана загрузки с анимацией welcome.json
 *
 * Этот компонент демонстрирует, как использовать WelcomeAnimatedScreen
 * для показа анимации загрузки до полной загрузки данных
 */
const LoadingExample: React.FC = () => {
    const [showLoading, setShowLoading] = useState(false);

    const handleStartLoading = () => {
        setShowLoading(true);
    };

    const handleLoadingComplete = () => {
        setShowLoading(false);
        console.log("Загрузка завершена!");
    };

    if (showLoading) {
        return <WelcomeAnimatedScreen onLoadingComplete={handleLoadingComplete} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Пример экрана загрузки</Text>
            <Text style={styles.description}>
                Нажмите кнопку, чтобы увидеть экран загрузки с анимацией
                welcome.json
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleStartLoading}
            >
                <Text style={styles.buttonText}>Показать загрузку</Text>
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
        marginBottom: 20,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#6A6A6E",
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 24,
    },
    button: {
        backgroundColor: "#E1D24A",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "#16151B",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default LoadingExample;
