import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import { TYPOGRAPHY } from "../../utils/constans/typography";
import { SIZES } from "../../utils/constans/sizes";
import { LinearGradient } from "expo-linear-gradient";
import { rw } from "../../utils/responsive";

type ButtonProps = {
    children?: React.ReactNode;
    backgroundColor?: string;
    textColor?: string;
    gradientColors?: readonly string[];
    disabled?: boolean
    onPress?: () => void;
};

const Button: React.FC<ButtonProps> = ({
    children,
    backgroundColor,
    textColor = COLORS.background,
    gradientColors,
    onPress,
    ...props
}) => {
    if (gradientColors) {
        return (
            <TouchableOpacity onPress={onPress}>
                <LinearGradient
                    colors={gradientColors as [string, string, ...string[]]}
                    style={styles.button}
                    {...props}
                >
                    <Text style={[styles.text, { color: textColor }]}>
                        {children}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress}
            style={[styles.button, { backgroundColor }]}
            {...props}
        >
            <Text style={[styles.text, { color: textColor }]}>{children}</Text>
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: GRADIENT_COLORS.primary[0],
        padding: 10,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        height: SIZES.button.height,
        width: rw(80),
    },
    text: {
        fontFamily: TYPOGRAPHY.bold,
        fontSize: SIZES.fontSize.lg,
        fontWeight: "bold",
    },
});
