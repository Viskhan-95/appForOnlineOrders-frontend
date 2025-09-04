import React from "react";
import { Text, StyleSheet } from "react-native";
import { SIZES } from "../../utils/constans/sizes";
import { COLORS } from "../../utils/constans/colors";
import { TYPOGRAPHY } from "../../utils/constans/typography";

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
    },
});
