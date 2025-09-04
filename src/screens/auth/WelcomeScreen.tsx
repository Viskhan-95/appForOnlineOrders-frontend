import React from "react";
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ImageBackground,
} from "react-native";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import { SIZES } from "../../utils/constans/sizes";
import { TYPOGRAPHY } from "../../utils/constans/typography";
import { rw, rh } from "../../utils/responsive";

const WelcomeScreen: React.FC = () => {
    return (
        <>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require("../../assets/images/background.jpg")}
                    style={styles.image}
                />
                <View style={styles.header}>
                    <Header />
                </View>
                <View style={styles.content}>
                    <Text style={styles.text}>
                        Вкусная еда — это то, что вы заслуживаете здесь и сейчас
                    </Text>
                    <Button
                        gradientColors={GRADIENT_COLORS.primary}
                        textColor={COLORS.textActive}
                    >
                        <Text>Войти</Text>
                    </Button>

                    {/* С обычным цветом */}
                    <Button
                        backgroundColor={COLORS.backgroundSecondary}
                        textColor={COLORS.textLinkSecondary}
                    >
                        <Text>Зарегистрироваться</Text>
                    </Button>
                </View>
            </SafeAreaView>
        </>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: rh(100),
        width: rw(100),
        backgroundColor: COLORS.background,
        alignItems: "center",
    },
    image: {
        width: rw(100),
        height: rh(100),
        opacity: 0.3,
        position: "absolute",
    },
    header: {
        flex: 1,
        justifyContent: "center",
    },
    content: {
        flex: 1,
        justifyContent: "space-evenly",
        // gap: rh(4),
    },
    text: {
        fontSize: SIZES.fontSize.xxl,
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.bold,
        fontWeight: "bold",
        width: rw(75),
        lineHeight: rh(4),
    },
});
