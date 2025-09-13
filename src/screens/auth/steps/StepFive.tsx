import { Image, Text, View } from "react-native";
import { styles } from "./styles";
import StepContainer from "./StepContainer";
import Subtitle from "../../../components/ui/Subtitle";
import Button from "../../../components/ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constants/colors";
import GradientText from "../../../components/ui/GradientText";
import { SIZES } from "../../../utils/constants/sizes";
import React, { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

const StepFive: React.FC = () => {
    const { clearRegistrationCompletedFlag, resetStep } = useAuth();

    // Автоматическая навигация через 30 секунд
    useEffect(() => {
        const timer = setTimeout(() => {
            // Сбрасываем шаг регистрации, чтобы пользователь перешел в Main
            resetStep();
        }, 30000);

        return () => clearTimeout(timer);
    }, [resetStep]);

    const handleContinue = () => {
        // Сбрасываем шаг регистрации, чтобы пользователь перешел в Main
        resetStep();
    };

    return (
        <StepContainer>
            <View
                style={{
                    flex: 1,
                    alignSelf: "center",
                    justifyContent: "center",
                }}
            >
                <Image source={require("../../../assets/icons/ok.png")} />
            </View>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <GradientText
                        gradientColors={GRADIENT_COLORS.primary}
                        fontSize={SIZES.fontSize.largeTitle}
                        textAlign="center"
                    >
                        Поздравляем
                    </GradientText>
                    <Subtitle>Ваш профиль готов к использованию</Subtitle>
                </View>
            </View>
            <Button
                gradientColors={GRADIENT_COLORS.primary}
                textColor={COLORS.background}
                onPress={handleContinue}
            >
                <Text>Перейти в приложение</Text>
            </Button>
        </StepContainer>
    );
};

export default StepFive;
