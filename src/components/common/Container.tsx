import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { COLORS } from "../../utils/constants/colors";
import { SIZES } from "../../utils/constants/sizes";
import { rw, rh } from "../../utils/responsive";

interface ContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    backgroundColor?: keyof typeof COLORS;
    padding?: keyof typeof SIZES.padding;
    margin?: keyof typeof SIZES.margin;
    borderRadius?: keyof typeof SIZES.borderRadius;
    centerContent?: boolean;
    flex?: number;
}

/**
 * Универсальный контейнер с предустановленными стилями
 */
const Container: React.FC<ContainerProps> = React.memo(
    ({
        children,
        style,
        backgroundColor = "background",
        padding = "md",
        margin = "xs",
        borderRadius = "medium",
        centerContent = false,
        flex,
    }) => {
        const containerStyle: StyleProp<ViewStyle> = {
            backgroundColor: COLORS[backgroundColor],
            padding: SIZES.padding[padding],
            margin: SIZES.margin[margin],
            borderRadius: SIZES.borderRadius[borderRadius],
            ...(centerContent && {
                justifyContent: "center",
                alignItems: "center",
            }),
            ...(flex !== undefined && { flex }),
        };

        return <View style={[containerStyle, style]}>{children}</View>;
    }
);

Container.displayName = "Container";

export default Container;
