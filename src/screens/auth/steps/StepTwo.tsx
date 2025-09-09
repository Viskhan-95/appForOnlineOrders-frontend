import React, { useState } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import StepContainer from "./StepContainer";
import Title from "../../../components/ui/Title";
import Subtitle from "../../../components/ui/Subtitle";
import FormInput from "../../../components/ui/FormInput";
import ArrowBack from "../../../components/ui/ArrowBack";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constans/colors";
import Button from "../../../components/ui/Button";

const StepTwo = () => {
    const [firstName, setfirstName] = useState("");
    const [lastName, setLastName] = useState("");

    return (
        <StepContainer>
            <ArrowBack />
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Title textSize="xxl">
                        Введите свои данные, чтобы продолжить
                    </Title>
                    <Subtitle>
                        ФИО будет использоваться в вашем профиле
                    </Subtitle>
                </View>
            </View>
            <View style={styles.formContainer}>
                <FormInput
                    icon={require("../../../assets/icons/profile.png")}
                    placeholder="Введите имя"
                    value={firstName}
                    onChangeText={setfirstName}
                />
                <FormInput
                    icon={require("../../../assets/icons/profile.png")}
                    placeholder="Введите фамилию"
                    value={lastName}
                    onChangeText={setLastName}
                />
            </View>
            <Button
                backgroundColor={GRADIENT_COLORS.primary[0]}
                textColor={COLORS.background}
            >
                <Text>Далее</Text>
            </Button>
        </StepContainer>
    );
};

export default StepTwo;
