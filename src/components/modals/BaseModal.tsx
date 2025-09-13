import React from "react";
import {
    View,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    StatusBar,
} from "react-native";
import { COLORS } from "../../utils/constants/colors";
import { SIZES } from "../../utils/constants/sizes";
import { rw, rh } from "../../utils/responsive";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface BaseModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    blurIntensity?: number;
    backgroundColor?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
    visible,
    onClose,
    children,
    blurIntensity = 20,
    backgroundColor = "rgba(0, 0, 0, 0.5)",
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <StatusBar
                backgroundColor="rgba(0, 0, 0, 0.5)"
                barStyle="light-content"
            />
            <View style={styles.overlay}>
                <View style={[styles.blurContainer, { backgroundColor }]}>
                    <TouchableOpacity
                        style={styles.backdrop}
                        activeOpacity={1}
                        onPress={onClose}
                    >
                        <View style={styles.modalContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={(e) => e.stopPropagation()}
                            >
                                {children}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    blurContainer: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: "center",
        alignItems: "center",
    },
    backdrop: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: rw(85),
        maxWidth: 400,
        backgroundColor: COLORS.background,
        borderRadius: SIZES.borderRadius.large,
        padding: rw(6),
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 20,
    },
});

export default BaseModal;
