import React, { useEffect, useState } from "react";
import StepContainer from "./StepContainer";
import ArrowBack from "../../../components/ui/ArrowBack";
import { styles } from "./styles";
import {
    FlatList,
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

const INPUT_HEIGHT = 56;

const StepThree = () => {
    // Поля формы
    const [cityQuery, setCityQuery] = useState("");
    const [streetQuery, setStreetQuery] = useState("");
    const [house, setHouse] = useState("");
    const [apartment, setApartment] = useState("");

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

    // Выборы
    const pickCity = (opt: CityOption) => {
        setSelectedCity(opt);
        setCityQuery(opt.label);
        // Сброс улицы
        setSelectedStreet(null);
        setStreetQuery("");
        setStreetOptions([]);
        // Закрытие выпадающего списка
        setCityFocused(false);
        setCityOptions([]);
    };

    const pickStreet = (opt: StreetOption) => {
        setSelectedStreet(opt);
        setStreetQuery(opt.label);
        setStreetFocused(false);
        setStreetOptions([]);
    };

    // Итоговый адрес (если нужно)
    const fullAddress = [cityQuery, streetQuery, house, apartment]
        .filter(Boolean)
        .join(", ");

    return (
        <StepContainer>
            <ArrowBack />
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Title textSize="xxl">Укажите свое местоположение</Title>
                    <Subtitle>Ваши данные буду доступны только вам</Subtitle>
                </View>
            </View>

            <View style={styles.formContainer}>
                {/* Город/село */}
                <View style={local.overlayContainer}>
                    <FormInput
                        placeholder="Город / село"
                        value={cityQuery}
                        onChangeText={(t) => {
                            setCityQuery(t);
                            // При ручном вводе считаем, что город ещё не выбран
                            setSelectedCity(null);
                        }}
                        onFocus={() => setCityFocused(true)}
                        onBlur={() =>
                            setTimeout(() => setCityFocused(false), 150)
                        }
                    />
                    {cityQuery.trim().length >= 3 && cityOptions.length > 0 && (
                        <View style={[local.dropdown, { top: rh(7) }]}>
                            <ScrollView keyboardShouldPersistTaps="handled">
                                {cityOptions.map((item) => (
                                    <TouchableOpacity
                                        key={item.fiasId}
                                        style={local.option}
                                        onPress={() => pickCity(item)}
                                    >
                                        <Text style={local.optionText}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Улица */}
                <View style={local.overlayContainer}>
                    <FormInput
                        placeholder="Улица"
                        value={streetQuery}
                        onChangeText={(t) => {
                            setStreetQuery(t);
                            setSelectedStreet(null);
                        }}
                        onFocus={() => setStreetFocused(true)}
                        onBlur={() =>
                            setTimeout(() => setStreetFocused(false), 150)
                        }
                        // editable={!!selectedCity} // опционально блокируем пока не выбран город
                    />
                    {streetFocused &&
                        selectedCity?.fiasId &&
                        streetQuery.trim().length >= 3 &&
                        streetOptions.length > 0 && (
                            <View style={[local.dropdown, { top: rh(7) }]}>
                                <ScrollView keyboardShouldPersistTaps="handled">
                                    {streetOptions.map((item) => (
                                        <TouchableOpacity
                                            key={item.fiasId}
                                            style={local.option}
                                            onPress={() => pickStreet(item)}
                                        >
                                            <Text style={local.optionText}>
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                </View>

                {/* Дом — ручной ввод */}
                <FormInput
                    placeholder="Дом"
                    value={house}
                    onChangeText={setHouse}
                />

                {/* Квартира — ручной ввод */}
                <FormInput
                    placeholder="Квартира"
                    value={apartment}
                    onChangeText={setApartment}
                />
            </View>

            <Button
                backgroundColor={GRADIENT_COLORS.primary[0]}
                textColor={COLORS.background}
                onPress={() => {}}
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
    },
    dropdown: {
        position: "absolute",
        top: 56, // высота инпута
        left: 0,
        right: 0,
        maxHeight: 220,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        paddingVertical: 6,
        zIndex: 1000, // iOS
        elevation: 10, // Android
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
