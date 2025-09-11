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
        marginBottom: rh(3)
    }
});
