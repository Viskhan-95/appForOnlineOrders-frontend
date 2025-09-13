import React, { useState } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import StepContainer from "./StepContainer";
import Title from "../../../components/ui/Title";
import Subtitle from "../../../components/ui/Subtitle";
import FormInput from "../../../components/ui/FormInput";
import ArrowBack from "../../../components/ui/ArrowBack";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constants/colors";
import Button from "../../../components/ui/Button";
import { Controller, useFormContext } from "react-hook-form";

type Props = { onPrev: () => void; onNext: () => void };

const StepTwo: React.FC<Props> = ({ onPrev, onNext }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <StepContainer>
            <ArrowBack onPress={onPrev} />
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
                <Controller
                    control={control}
                    name="firstName"
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                        <View style={styles.marginBottom}>
                            <FormInput
                                icon={require("../../../assets/icons/profile.png")}
                                placeholder="Введите имя"
                                value={value}
                                onChangeText={onChange}
                            />
                            {!!errors.firstName && (
                                <Text style={{ color: COLORS.error }}>
                                    {String(errors.firstName.message)}
                                </Text>
                            )}
                        </View>
                    )}
                />
                <Controller
                    control={control}
                    name="lastName"
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                        <View style={styles.marginBottom}>
                            <FormInput
                                icon={require("../../../assets/icons/profile.png")}
                                placeholder="Введите фамилию"
                                value={value}
                                onChangeText={onChange}
                            />
                            {!!errors.lastName && (
                                <Text style={{ color: COLORS.error }}>
                                    {String(errors.lastName.message)}
                                </Text>
                            )}
                        </View>
                    )}
                />
            </View>
            <Button
                gradientColors={GRADIENT_COLORS.primary}
                textColor={COLORS.background}
                onPress={onNext}
            >
                <Text>Далее</Text>
            </Button>
        </StepContainer>
    );
};

export default StepTwo;
