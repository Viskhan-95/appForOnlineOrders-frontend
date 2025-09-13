import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { COLORS } from "../../utils/constants/colors";
import { rh, rw } from "../../utils/responsive";

const NotFoundScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require("../assets/animations/notFound.json")}
                autoPlay
                loop
                style={styles.lottie}
            />
        </View>
    );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    lottie: {
        width: rw(100),
        height: rh(100),
    },
});
