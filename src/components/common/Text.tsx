import React from "react";
import {
    Text as RNText,
    TextProps as RNTextProps,
    StyleProp,
    TextStyle,
} from "react-native";
import { COLORS } from "../../utils/constants/colors";
import { SIZES } from "../../utils/constants/sizes";

interface TextProps extends RNTextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    color?: keyof typeof COLORS;
    fontSize?: keyof typeof SIZES.fontSize;
    fontWeight?: "normal" | "bold" | "500" | "600" | "700";
    textAlign?: "left" | "center" | "right" | "justify";
    center?: boolean;
}

/**
 * Универсальный текстовый компонент с предустановленными стилями
 */
const Text: React.FC<TextProps> = React.memo(
    ({
        children,
        style,
        color = "text",
        fontSize = "md",
        fontWeight = "normal",
        textAlign = "left",
        center = false,
        ...props
    }) => {
        const textStyle: StyleProp<TextStyle> = {
            color: COLORS[color],
            fontSize: SIZES.fontSize[fontSize],
            fontWeight,
            textAlign: center ? "center" : textAlign,
        };

        return (
            <RNText style={[textStyle, style]} {...props}>
                {children}
            </RNText>
        );
    }
);

Text.displayName = "Text";

export default Text;
