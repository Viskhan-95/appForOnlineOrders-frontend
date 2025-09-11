import { Image, Text, View } from "react-native";
import { styles } from "./styles";
import StepContainer from "./StepContainer";
import Subtitle from "../../../components/ui/Subtitle";
import Button from "../../../components/ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constans/colors";
import GradientText from "../../../components/ui/GradientText";
import { SIZES } from "../../../utils/constans/sizes";
import React from "react";

type Props = { onBackToAddress: () => void };

const StepFour: React.FC<Props> = () => {
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
                onPress={() => {}}
            >
                <Text>Далее</Text>
            </Button>
        </StepContainer>
    );
};

export default StepFour;
