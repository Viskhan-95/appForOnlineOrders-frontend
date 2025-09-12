import { StyleSheet } from "react-native";
import { rh, rw } from "../../../utils/responsive";
import { COLORS } from "../../../utils/constans/colors";
import { SIZES } from "../../../utils/constans/sizes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: "center",
    },
    image: {
        width: rw(100),
        height: rh(100),
        opacity: 0.15,
        position: "absolute",
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingVertical: rh(8),
    },
    header: {
        flex: 1,
        alignItems: "center",
    },
    titleContainer: {
        alignItems: "center",
        marginTop: rh(8),
        gap: rh(2),
    },
    formContainer: {
        flex: 1,
        width: rw(80),
        alignSelf: "center",
    },
    isAccount: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: rh(2),
        gap: rw(2),
    },
    isAccountText: {
        color: COLORS.text,
        fontSize: SIZES.fontSize.lg,
    },
    isAccountLink: {
        color: COLORS.textLink,
        fontSize: SIZES.fontSize.lg,
    },
    marginBottom: {
        marginBottom: rh(2),
    },
    errorText: {
        color: COLORS.error,
        width: "100%",
        alignSelf: "flex-start",
    },
    // Стили для StepFour (код подтверждения)
    resendContainer: {
        alignItems: "center",
        marginTop: rh(2),
    },
    countdownText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.fontSize.sm,
        textAlign: "center",
    },
    resendButton: {
        paddingVertical: rh(1),
        paddingHorizontal: rw(4),
    },
    resendText: {
        color: COLORS.primary,
        fontSize: SIZES.fontSize.sm,
        textAlign: "center",
        textDecorationLine: "underline",
    },
    resendTextDisabled: {
        color: COLORS.textSecondary,
        textDecorationLine: "none",
    },
    successIcon: {
        width: rw(5),
        height: rh(2.5),
    },
});
