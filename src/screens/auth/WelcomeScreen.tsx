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
import { COLORS, GRADIENT_COLORS } from "../../utils/constants/colors";
import { rw, rh } from "../../utils/responsive";
import Title from "../../components/ui/Title";
import { useAppNavigation } from "../../hooks/useAppNavigation";

const WelcomeScreen: React.FC = () => {
    const navigation = useAppNavigation();

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require("../../assets/images/backgroundWelcome.jpg")}
                    style={styles.image}
                />
                <View style={styles.header}>
                    <Header />
                </View>
                <View style={styles.content}>
                    <Title textSize="xxl">
                        Вкусная еда — это то, что вы заслуживаете здесь и сейчас
                    </Title>
                    <Button
                        gradientColors={GRADIENT_COLORS.primary}
                        textColor={COLORS.textActive}
                        onPress={() => navigation.navigate("Auth")}
                    >
                        <Text>Войти</Text>
                    </Button>

                    <Button
                        backgroundColor={COLORS.backgroundSecondary}
                        textColor={COLORS.textLinkSecondary}
                        onPress={() => navigation.navigate("Register")}
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
    },
});
