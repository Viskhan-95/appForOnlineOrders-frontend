import React from "react";
import { Text, StyleSheet } from "react-native";
import { SIZES } from "../../utils/constants/sizes";
import { COLORS } from "../../utils/constants/colors";
import { TYPOGRAPHY } from "../../utils/constants/typography";

const Header: React.FC = () => {
    return (
        <>
            <Text style={styles.header}>ONLINE ORDERS</Text>
        </>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        fontSize: SIZES.fontSize.title,
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.bold,
        fontWeight: "bold",
        textAlign: "center",
    },
});
