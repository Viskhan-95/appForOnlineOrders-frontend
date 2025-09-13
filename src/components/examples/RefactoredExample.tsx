import React from "react";
import { View, ScrollView } from "react-native";
import Container from "../common/Container";
import Text from "../common/Text";
import StyledButton from "../common/StyledButton";
import { useCommonStyles } from "../../hooks/useCommonStyles";
import { useColors, useResponsiveSizes } from "../../hooks/useCommonStyles";

/**
 * Пример использования рефакторенных компонентов
 * Демонстрирует новый подход к стилизации
 */
const RefactoredExample: React.FC = () => {
    const styles = useCommonStyles();
    const colors = useColors();
    const sizes = useResponsiveSizes();

    const handlePress = (variant: string) => {
        console.log(`Pressed ${variant} button`);
    };

    return (
        <ScrollView style={styles.container}>
            <Container
                backgroundColor="surface"
                padding="lg"
                margin="md"
                centerContent
            >
                <Text fontSize="xxl" fontWeight="bold" color="text" center>
                    🎨 Рефакторенные компоненты
                </Text>

                <Text fontSize="md" color="textSecondary" center>
                    Пример использования новых универсальных компонентов
                </Text>
            </Container>

            <Container backgroundColor="surface" padding="md" margin="sm">
                <Text fontSize="lg" fontWeight="600" marginBottom="md">
                    Кнопки разных вариантов:
                </Text>

                <View style={{ gap: sizes.margin.md }}>
                    <StyledButton
                        variant="primary"
                        size="medium"
                        onPress={() => handlePress("primary")}
                    >
                        Primary Button
                    </StyledButton>

                    <StyledButton
                        variant="secondary"
                        size="medium"
                        onPress={() => handlePress("secondary")}
                    >
                        Secondary Button
                    </StyledButton>

                    <StyledButton
                        variant="success"
                        size="medium"
                        onPress={() => handlePress("success")}
                    >
                        Success Button
                    </StyledButton>

                    <StyledButton
                        variant="error"
                        size="medium"
                        onPress={() => handlePress("error")}
                        loading
                    >
                        Loading Button
                    </StyledButton>
                </View>
            </Container>

            <Container backgroundColor="surface" padding="md" margin="sm">
                <Text fontSize="lg" fontWeight="600" marginBottom="md">
                    Текст разных размеров:
                </Text>

                <Text fontSize="xs" color="textSecondary">
                    Extra Small Text
                </Text>

                <Text fontSize="sm" color="textSecondary">
                    Small Text
                </Text>

                <Text fontSize="md" color="text">
                    Medium Text (default)
                </Text>

                <Text fontSize="lg" color="text" fontWeight="600">
                    Large Text
                </Text>

                <Text fontSize="xxl" color="text" fontWeight="bold">
                    Extra Large Text
                </Text>
            </Container>

            <Container
                backgroundColor="surface"
                padding="md"
                margin="sm"
                centerContent
            >
                <Text fontSize="md" color="textSecondary" center>
                    Все компоненты используют:
                </Text>
                <Text fontSize="sm" color="textSecondary" center>
                    ✅ Константы цветов и размеров
                </Text>
                <Text fontSize="sm" color="textSecondary" center>
                    ✅ Адаптивные утилиты (rw/rh)
                </Text>
                <Text fontSize="sm" color="textSecondary" center>
                    ✅ Мемоизацию для производительности
                </Text>
                <Text fontSize="sm" color="textSecondary" center>
                    ✅ TypeScript типизацию
                </Text>
            </Container>
        </ScrollView>
    );
};

export default RefactoredExample;
