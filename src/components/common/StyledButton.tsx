import React from "react";
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleProp,
    ViewStyle,
    ActivityIndicator,
} from "react-native";
import { COLORS } from "../../utils/constants/colors";
import { SIZES } from "../../utils/constants/sizes";
import { rw, rh } from "../../utils/responsive";
import Text from "./Text";

interface StyledButtonProps extends TouchableOpacityProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: "primary" | "secondary" | "error" | "success";
    size?: "small" | "medium" | "large";
    loading?: boolean;
    disabled?: boolean;
    center?: boolean;
}

/**
 * Универсальная кнопка с предустановленными стилями
 */
const StyledButton: React.FC<StyledButtonProps> = React.memo(
    ({
        children,
        style,
        variant = "primary",
        size = "medium",
        loading = false,
        disabled = false,
        center = true,
        ...props
    }) => {
        const getVariantStyles = () => {
            switch (variant) {
                case "primary":
                    return {
                        backgroundColor: COLORS.primary,
                        borderColor: COLORS.primary,
                    };
                case "secondary":
                    return {
                        backgroundColor: COLORS.secondary,
                        borderColor: COLORS.secondary,
                    };
                case "error":
                    return {
                        backgroundColor: COLORS.error,
                        borderColor: COLORS.error,
                    };
                case "success":
                    return {
                        backgroundColor: COLORS.success,
                        borderColor: COLORS.success,
                    };
                default:
                    return {
                        backgroundColor: COLORS.primary,
                        borderColor: COLORS.primary,
                    };
            }
        };

        const getSizeStyles = () => {
            switch (size) {
                case "small":
                    return {
                        paddingVertical: SIZES.padding.sm,
                        paddingHorizontal: SIZES.padding.md,
                        borderRadius: SIZES.borderRadius.small,
                    };
                case "medium":
                    return {
                        paddingVertical: SIZES.padding.md,
                        paddingHorizontal: SIZES.padding.lg,
                        borderRadius: SIZES.borderRadius.medium,
                    };
                case "large":
                    return {
                        paddingVertical: SIZES.padding.lg,
                        paddingHorizontal: SIZES.padding.xl,
                        borderRadius: SIZES.borderRadius.large,
                    };
                default:
                    return {
                        paddingVertical: SIZES.padding.md,
                        paddingHorizontal: SIZES.padding.lg,
                        borderRadius: SIZES.borderRadius.medium,
                    };
            }
        };

        const variantStyles = getVariantStyles();
        const sizeStyles = getSizeStyles();

        const buttonStyle: StyleProp<ViewStyle> = {
            ...variantStyles,
            ...sizeStyles,
            opacity: disabled || loading ? 0.6 : 1,
            flexDirection: "row",
            justifyContent: center ? "center" : "flex-start",
            alignItems: "center",
            borderWidth: 1,
        };

        const getTextColor = () => {
            switch (variant) {
                case "primary":
                case "secondary":
                case "error":
                case "success":
                    return "background" as keyof typeof COLORS;
                default:
                    return "text" as keyof typeof COLORS;
            }
        };

        return (
            <TouchableOpacity
                style={[buttonStyle, style]}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <ActivityIndicator
                        size="small"
                        color={COLORS[getTextColor()]}
                        style={{ marginRight: SIZES.margin.xs }}
                    />
                )}
                <Text color={getTextColor()} fontWeight="600" center={center}>
                    {children}
                </Text>
            </TouchableOpacity>
        );
    }
);

StyledButton.displayName = "StyledButton";

export default StyledButton;
