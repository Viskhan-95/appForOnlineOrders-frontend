import React, { useEffect, useState } from "react";
import StepContainer from "./StepContainer";
import ArrowBack from "../../../components/ui/ArrowBack";
import { styles } from "./styles";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Title from "../../../components/ui/Title";
import Subtitle from "../../../components/ui/Subtitle";
import FormInput from "../../../components/ui/FormInput";
import Button from "../../../components/ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constans/colors";
import { rh, rw } from "../../../utils/responsive";
import {
    CityOption,
    StreetOption,
    suggestCity,
    suggestStreet,
} from "../../../services/dadata";
import { useDebouncedValue } from "../../../hooks/useDebounce";
import { useFormContext, useWatch } from "react-hook-form";

type Props = { onPrev: () => void; onNext: () => void };

const StepThree: React.FC<Props> = ({ onPrev, onNext }) => {
    const { getValues, setValue, trigger } = useFormContext();

    const pickCity = (opt: CityOption) => {
        setSelectedCity(opt); // ВАЖНО: чтобы заработали улицы
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

    // Поля формы
    const [cityQuery, setCityQuery] = useState("");
    const [streetQuery, setStreetQuery] = useState("");

    // Подсказки
    const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
    const [streetOptions, setStreetOptions] = useState<StreetOption[]>([]);

    // Выбранные сущности
    const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
    const [selectedStreet, setSelectedStreet] = useState<StreetOption | null>(
        null
    );

    // Фокус полей для показа выпадашек
    const [cityFocused, setCityFocused] = useState(false);
    const [streetFocused, setStreetFocused] = useState(false);

    // Дебаунс
    const dCity = useDebouncedValue(cityQuery, 350);
    const dStreet = useDebouncedValue(streetQuery, 350);

    const house = useWatch({ name: "house" });
    const apartment = useWatch({ name: "apartment" });

    // Подсказки города/села
    useEffect(() => {
        (async () => {
            const q = dCity.trim();
            if (q.length < 3) {
                setCityOptions([]);
                return;
            }
            try {
                const res = await suggestCity(q);
                setCityOptions(res);
            } catch (e: any) {
                setCityOptions([]);
            }
        })();
    }, [dCity]);

    // Подсказки улицы (зависят от выбранного города/села)
    useEffect(() => {
        (async () => {
            const q = dStreet.trim();
            if (!selectedCity?.fiasId || q.length < 3) {
                setStreetOptions([]);
                return;
            }
            try {
                const res = await suggestStreet(q, selectedCity);
                setStreetOptions(res);
            } catch {
                setStreetOptions([]);
            }
        })();
    }, [dStreet, selectedCity]);

    // // Итоговый адрес (если нужно)
    // const fullAddress = [cityQuery, streetQuery, house, apartment]
    //     .filter(Boolean)
    //     .join(", ");

    const handleNext = async () => {
        const ok = await trigger(["city", "street", "house"]);
        if (ok) onNext();
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
                {/* Город/село */}
                <View style={local.overlayContainer}>
                    <View style={styles.marginBottom}>
                        <FormInput
                            placeholder="Город / село"
                            value={getValues("city")}
                            onChangeText={(t) => {
                                setValue("city", t, { shouldValidate: true });
                                setCityQuery(t);
                            }}
                            onFocus={() => setCityFocused(true)}
                            onBlur={() =>
                                setTimeout(() => setCityFocused(false), 150)
                            }
                        />
                        {!!errors.city && (
                            <Text style={{ color: COLORS.error }}>
                                {String(errors.city.message)}
                            </Text>
                        )}
                    </View>
                    {cityFocused &&
                        dCity.trim().length >= 3 &&
                        cityOptions.length > 0 && (
                            <View style={[local.dropdown, { top: rh(7) }]}>
                                <ScrollView keyboardShouldPersistTaps="handled">
                                    {cityOptions.map((o) => (
                                        <TouchableOpacity
                                            key={o.fiasId || o.label}
                                            style={local.option}
                                            onPress={() => pickCity(o)}
                                        >
                                            <Text style={local.optionText}>
                                                {o.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                </View>

                {/* Улица */}
                <View style={local.overlayContainer}>
                    <View style={styles.marginBottom}>
                        <FormInput
                            placeholder="Улица"
                            value={getValues("street")}
                            onChangeText={(t) => {
                                setValue("street", t, { shouldValidate: true });
                                setStreetQuery(t);
                            }}
                            onFocus={() => setStreetFocused(true)}
                            onBlur={() =>
                                setTimeout(() => setStreetFocused(false), 150)
                            }
                        />
                        {!!errors.street && (
                            <Text style={{ color: COLORS.error }}>
                                {String(errors.street.message)}
                            </Text>
                        )}
                    </View>
                    {streetFocused &&
                        dStreet.trim().length >= 3 &&
                        streetOptions.length > 0 && (
                            <View style={[local.dropdown, { top: rh(7) }]}>
                                <ScrollView keyboardShouldPersistTaps="handled">
                                    {streetOptions.map((o) => (
                                        <TouchableOpacity
                                            key={o.fiasId || o.label}
                                            style={local.option}
                                            onPress={() =>
                                                pickStreet(o.label, o.fiasId)
                                            }
                                        >
                                            <Text style={local.optionText}>
                                                {o.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                </View>
                <View style={styles.marginBottom}>
                    <FormInput
                        placeholder="Дом"
                        value={house}
                        onChangeText={(t) =>
                            setValue("house", t.replace(/[^0-9/-]/g, ""), {
                                shouldValidate: true,
                            })
                        }
                        keyboardType={Platform.select({
                            ios: "numbers-and-punctuation",
                            android: "visible-password",
                        })}
                    />
                    {!!errors.house && (
                        <Text style={{ color: COLORS.error }}>
                            {String(errors.house.message)}
                        </Text>
                    )}
                </View>

                {/* Квартира — ручной ввод */}
                <View style={styles.marginBottom}>
                    <FormInput
                        placeholder="Квартира"
                        value={apartment}
                        onChangeText={(t) => setValue("apartment", t)}
                        keyboardType="number-pad"
                    />
                    {!!errors.apartment && (
                        <Text style={{ color: COLORS.error }}>
                            {String(errors.apartment.message)}
                        </Text>
                    )}
                </View>
            </View>

            <Button
                backgroundColor={GRADIENT_COLORS.primary[0]}
                textColor={COLORS.background}
                onPress={handleNext}
            >
                <Text>Далее</Text>
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
    dropdown: {
        position: "absolute",
        top: rh(7),
        left: 0,
        right: 0,
        maxHeight: 220,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        paddingVertical: 6,
        zIndex: 1000,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    option: {
        paddingVertical: rh(1.8),
        paddingHorizontal: rw(3),
    },
    optionText: {
        color: COLORS.text,
    },
});
