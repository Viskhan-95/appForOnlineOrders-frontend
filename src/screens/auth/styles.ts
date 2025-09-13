import { StyleSheet } from "react-native";
import { COLORS } from "../../utils/constants/colors";
import { SIZES } from "../../utils/constants/sizes";
import { rh } from "../../utils/responsive";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.15,
    },
    safeArea: {
        flexGrow: 1,
        alignItems: "center",
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingTop: rh(10),
    },
    titleContainer: {
        alignItems: "center",
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontSize: SIZES.fontSize.lg,
        textAlign: "right",
    },
});
