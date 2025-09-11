import { StyleSheet } from "react-native";
import { COLORS } from "../../utils/constans/colors";
import { rh, rw } from "../../utils/responsive";

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
        paddingVertical: rh(5),
    },
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: rh(10),
    },
    titleContainer: {
        alignItems: "center",
        marginTop: rh(8),
        gap: rh(2),
    },
    formContainer: {
        flex: 1,
        gap: rh(3),
        width: rw(80),
        alignSelf: "center",
    },
    forgotPassword: {
        marginVertical: rh(2),
    },
});
