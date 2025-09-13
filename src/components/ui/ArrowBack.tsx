import React from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { rh, rw } from "../../utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENT_COLORS } from "../../utils/constants/colors";

type ArrowBackProps = {
    gradientColors?: readonly string[];
    onPress?: () => void;
};

const ArrowBack: React.FC<ArrowBackProps> = ({ gradientColors, onPress }) => {
    const colors = (gradientColors ?? GRADIENT_COLORS.primary) as [
        string,
        string,
        ...string[]
    ];

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <LinearGradient style={styles.gradient} colors={colors}>
                <Image
                    source={require("../../assets/icons/arrow.png")}
                    resizeMode="contain"
                />
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default ArrowBack;

const styles = StyleSheet.create({
    container: {
        width: rw(12),
        height: rw(12),
        borderRadius: rw(1),
        overflow: "hidden"
    },
    gradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
