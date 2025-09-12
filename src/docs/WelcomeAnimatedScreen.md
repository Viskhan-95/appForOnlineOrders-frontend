# Экран загрузки с анимацией Lottie

## Описание

Реализован экран загрузки с анимацией `welcome.json`, который показывается при запуске приложения до полной загрузки всех данных и изображений.

## Компоненты

### 1. WelcomeAnimatedScreen

-   **Путь**: `src/screens/main/WelcomeAnimatedScreen.tsx`
-   **Функции**:
    -   Показывает анимацию Lottie из `welcome.json`
    -   Отображает прогресс загрузки
    -   Показывает текст состояния загрузки
    -   Автоматически скрывается после завершения

### 2. useAppLoading Hook

-   **Путь**: `src/hooks/useAppLoading.ts`
-   **Функции**:
    -   Управляет состоянием загрузки
    -   Предзагружает изображения
    -   Имитирует процесс загрузки данных
    -   Возвращает прогресс и текст загрузки

### 3. ImagePreloader

-   **Путь**: `src/utils/imagePreloader.ts`
-   **Функции**:
    -   Предзагрузка локальных изображений
    -   Предзагрузка удаленных изображений
    -   Кэширование загруженных изображений
    -   Обработка ошибок загрузки

## Использование

### Базовое использование

```tsx
import WelcomeAnimatedScreen from "../screens/main/WelcomeAnimatedScreen";

const MyScreen = () => {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    if (isLoading) {
        return <WelcomeAnimatedScreen onLoadingComplete={handleLoadingComplete} />;
    }

    return <YourMainContent />;
};
```

### С кастомным хуком

```tsx
import { useAppLoading } from "../hooks/useAppLoading";

const MyScreen = () => {
    const { isLoading, progress, loadingText } = useAppLoading();

    if (isLoading) {
        return <WelcomeAnimatedScreen />;
    }

    return <YourMainContent />;
};
```

### Предзагрузка изображений

```tsx
import { preloadLocalImages, preloadImages } from "../utils/imagePreloader";

// Предзагрузка локальных изображений
const localImages = [
    require("../assets/images/logo.png"),
    require("../assets/images/background.jpg"),
];
await preloadLocalImages(localImages);

// Предзагрузка удаленных изображений
const remoteImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
];
await preloadImages(remoteImages);
```

## Настройка

### Добавление изображений для предзагрузки

В файле `src/hooks/useAppLoading.ts` добавьте пути к изображениям:

```tsx
const IMAGES_TO_PRELOAD = [
    require("../assets/images/logo.png"),
    require("../assets/images/background.jpg"),
    require("../assets/images/restaurant-placeholder.png"),
    // Добавьте свои изображения
];
```

### Изменение времени загрузки

В хуке `useAppLoading` можно настроить:

```tsx
const minLoadingTime = 2000; // Минимальное время показа (мс)
```

### Кастомизация текстов загрузки

Измените тексты в функции `simulateLoading`:

```tsx
setLoadingState((prev) => ({
    ...prev,
    loadingText: "Ваш кастомный текст...",
}));
```

## Структура файлов

```
src/
├── screens/main/
│   └── WelcomeAnimatedScreen.tsx          # Основной компонент загрузки
├── hooks/
│   └── useAppLoading.ts           # Хук управления загрузкой
├── utils/
│   └── imagePreloader.ts          # Утилита предзагрузки изображений
├── examples/
│   └── LoadingExample.tsx         # Пример использования
└── docs/
    └── WelcomeAnimatedScreen.md           # Документация
```

## Особенности

1. **Анимация Lottie**: Использует `welcome.json` для красивого отображения
2. **Прогресс бар**: Показывает процент загрузки
3. **Предзагрузка**: Автоматически загружает изображения
4. **Обработка ошибок**: Продолжает работу даже при ошибках загрузки
5. **Адаптивность**: Использует responsive утилиты для разных экранов
6. **Градиентный фон**: Сохраняет дизайн приложения

## Требования

-   `lottie-react-native` - для анимаций
-   `expo-linear-gradient` - для градиентного фона
-   `react-native-responsive-screen` - для адаптивности

## Пример интеграции в HomeScreen

```tsx
const HomeScreen = () => {
    const [isAppLoading, setIsAppLoading] = useState(true);

    const handleLoadingComplete = () => {
        setIsAppLoading(false);
    };

    if (isAppLoading) {
        return <WelcomeAnimatedScreen onLoadingComplete={handleLoadingComplete} />;
    }

    return <YourMainContent />;
};
```
