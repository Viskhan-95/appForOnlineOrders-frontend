import React from "react";
import { Text, StyleSheet } from "react-native";
import { SIZES } from "../../utils/constans/sizes";
import { COLORS } from "../../utils/constans/colors";
import { TYPOGRAPHY } from "../../utils/constans/typography";
import { rh, rw } from "../../utils/responsive";

type TitleProps = {
    children: React.ReactNode;
    textSize?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "title" | "largeTitle";
};

const Title: React.FC<TitleProps> = ({ children, textSize = "title" }) => {
    return <Text style={[styles.title, { fontSize: SIZES.fontSize[textSize] }]}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
    title: {
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.bold,
        fontWeight: "bold",
        width: rw(75),
        lineHeight: rh(4),
    },
});
