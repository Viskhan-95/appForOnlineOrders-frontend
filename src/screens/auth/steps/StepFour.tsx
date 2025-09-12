import { Image, Text, View } from "react-native";
import { styles } from "./styles";
import StepContainer from "./StepContainer";
import Subtitle from "../../../components/ui/Subtitle";
import Button from "../../../components/ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constans/colors";
import GradientText from "../../../components/ui/GradientText";
import { SIZES } from "../../../utils/constans/sizes";
import React, { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

const StepFour: React.FC = () => {
    const { clearRegistrationCompletedFlag, resetStep } = useAuth();

    // Автоматическая навигация через 30 секунд
    useEffect(() => {
        const timer = setTimeout(() => {
            // Сбрасываем флаг регистрации и шаг, переходим в приложение
            clearRegistrationCompletedFlag();
            resetStep();
        }, 30000);

        return () => clearTimeout(timer);
    }, [clearRegistrationCompletedFlag, resetStep]);

    const handleContinue = () => {
        // Сбрасываем флаг регистрации и шаг, переходим в приложение
        clearRegistrationCompletedFlag();
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

export default StepFour;
