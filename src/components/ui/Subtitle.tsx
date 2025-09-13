import React from "react";
import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../utils/constants/colors";
import { TYPOGRAPHY } from "../../utils/constants/typography";
import { SIZES } from "../../utils/constants/sizes";
import { rh } from "../../utils/responsive";

type SubtitleProps = {
    children: React.ReactNode;
}

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
    return (
        <Text style={styles.subtitle}>{children}</Text>
    )
}

export default Subtitle;

const styles = StyleSheet.create({
    subtitle: {
        flex: 1,
        color: COLORS.textSubtitle,
        fontFamily: TYPOGRAPHY.regular,
        fontSize: SIZES.fontSize.sm,
        marginBottom: rh(4)
    },
});