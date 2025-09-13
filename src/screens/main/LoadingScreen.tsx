import React from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, GRADIENT_COLORS } from "../../utils/constants/colors";
import { rh, rw } from "../../utils/responsive";
import { useAppLoading } from "../../hooks/useAppLoading";

interface LoadingScreen {
    onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreen> = ({
    onLoadingComplete,
}) => {
    const { isLoading } = useAppLoading();

    React.useEffect(() => {
        if (!isLoading && onLoadingComplete) {
            onLoadingComplete();
        }
    }, [isLoading, onLoadingComplete]);

    return (
        <LinearGradient
            colors={GRADIENT_COLORS.primary}
            style={styles.container}
        >
            <View style={styles.content}>
                <LottieView
                    source={require("../../assets/animations/pizza.json")}
                    autoPlay
                    loop={isLoading}
                    style={styles.lottie}
                />
            </View>
        </LinearGradient>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    content: {
        alignItems: "center",
        justifyContent: "center",
    },
    lottie: {
        width: rw(80),
        height: rh(40),
        marginBottom: rh(3),
    },
});
