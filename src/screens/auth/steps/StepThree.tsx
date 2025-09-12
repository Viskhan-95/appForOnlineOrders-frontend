import React, { useState } from "react";
import StepContainer from "./StepContainer";
import ArrowBack from "../../../components/ui/ArrowBack";
import { styles } from "./styles";
import { Text, StyleSheet, View } from "react-native";
import Title from "../../../components/ui/Title";
import Subtitle from "../../../components/ui/Subtitle";
import Button from "../../../components/ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constans/colors";
import { rh, rw } from "../../../utils/responsive";
import { CityOption } from "../../../services/dadata";
import { useFormContext, useWatch } from "react-hook-form";
import CityField from "../../../components/forms/fields/CityField";
import StreetField from "../../../components/forms/fields/StreetField";
import HouseField from "../../../components/forms/fields/HouseField";
import ApartmentField from "../../../components/forms/fields/ApartmentField";
import { useDaDataCity } from "../../../hooks/useDaDataCity";
import { useDaDataStreet } from "../../../hooks/useDaDataStreet";

type Props = {
    onPrev: () => void;
    onNext: () => void;
    isLoading?: boolean;
    error?: string | null;
};

const StepThree: React.FC<Props> = ({
    onPrev,
    onNext,
    isLoading = false,
    error,
}) => {
    const { getValues, setValue, trigger } = useFormContext();

    // Фокус
    const [cityFocused, setCityFocused] = useState(false);
    const [streetFocused, setStreetFocused] = useState(false);

    // Выбор города
    const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);

    // Хуки подсказок
    const {
        query: cityQuery,
        setQuery: setCityQuery,
        options: cityOptions,
        setOptions: setCityOptions,
        loading: loadingCity,
    } = useDaDataCity();
    const {
        query: streetQuery,
        setQuery: setStreetQuery,
        options: streetOptions,
        setOptions: setStreetOptions,
        loading: loadingStreet,
    } = useDaDataStreet(selectedCity?.fiasId, selectedCity?.kind);

    const house = useWatch({ name: "house" });
    const apartment = useWatch({ name: "apartment" });

    const pickCity = (opt: CityOption) => {
        setSelectedCity(opt);
        setValue("city", opt.label, { shouldValidate: true });
        setValue("cityFiasId", opt.fiasId ?? "");
        setCityQuery(opt.label);
        setCityFocused(false);
        setCityOptions([]);
    };

    const pickStreet = (label: string, fiasId?: string) => {
        setValue("street", label, { shouldValidate: true });
        setValue("streetFiasId", fiasId ?? "");
        setStreetQuery(label);
        setStreetFocused(false);
        setStreetOptions([]);
    };

    const [submitting, setSubmitting] = useState(false);
    const handleNext = async () => {
        try {
            setSubmitting(true);
            const ok = await trigger(["city", "street", "house"]);
            if (ok) onNext();
        } finally {
            setSubmitting(false);
        }
    };

    const {
        formState: { errors },
    } = useFormContext();

    return (
        <StepContainer>
            <ArrowBack onPress={onPrev} />
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Title textSize="xxl">Укажите свое местоположение</Title>
                    <Subtitle>Ваши данные буду доступны только вам</Subtitle>
                </View>
            </View>

            <View style={styles.formContainer}>
                <View style={local.overlayContainer}>
                    <CityField
                        value={getValues("city")}
                        error={
                            errors.city
                                ? String(errors.city.message)
                                : undefined
                        }
                        onChange={(t) => {
                            setValue("city", t, { shouldValidate: true });
                            setCityQuery(t);
                        }}
                        options={cityOptions}
                        onPick={pickCity}
                        focused={cityFocused}
                        setFocused={setCityFocused}
                        loading={loadingCity}
                    />
                </View>

                <View style={local.overlayContainer}>
                    <StreetField
                        value={getValues("street")}
                        error={
                            errors.street
                                ? String(errors.street.message)
                                : undefined
                        }
                        onChange={(t) => {
                            setValue("street", t, { shouldValidate: true });
                            setStreetQuery(t);
                        }}
                        options={streetOptions}
                        onPick={(o) => pickStreet(o.label, (o as any).fiasId)}
                        focused={streetFocused}
                        setFocused={setStreetFocused}
                        loading={loadingStreet}
                    />
                </View>

                <HouseField
                    value={house}
                    error={
                        errors.house ? String(errors.house.message) : undefined
                    }
                    onChange={(t) =>
                        setValue("house", t, { shouldValidate: true })
                    }
                />

                <ApartmentField
                    value={apartment}
                    error={
                        errors.apartment
                            ? String(errors.apartment.message)
                            : undefined
                    }
                    onChange={(t) => setValue("apartment", t)}
                />
            </View>

            {/* Отображение ошибок */}
            {error && (
                <View
                    style={{
                        marginBottom: 16,
                        padding: 12,
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: COLORS.error, textAlign: "center" }}>
                        {error}
                    </Text>
                </View>
            )}

            <Button
                gradientColors={GRADIENT_COLORS.primary}
                textColor={COLORS.background}
                onPress={handleNext}
                disabled={submitting || isLoading}
            >
                <Text>
                    {isLoading
                        ? "Регистрация..."
                        : submitting
                        ? "Проверка..."
                        : "Завершить регистрацию"}
                </Text>
            </Button>
        </StepContainer>
    );
};

export default StepThree;

const local = StyleSheet.create({
    overlayContainer: {
        position: "relative",
        width: rw(80),
    },
});
