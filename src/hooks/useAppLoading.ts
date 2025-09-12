import { useState, useEffect, useCallback } from "react";
import { imagePreloader, preloadLocalImages } from "../utils/imagePreloader";

interface LoadingState {
    isLoading: boolean;
    progress: number;
    loadingText: string;
}

// Список изображений для предзагрузки
const IMAGES_TO_PRELOAD = [
    // Добавьте сюда пути к изображениям, которые нужно предзагрузить
    // require('../assets/images/logo.png'),
    // require('../assets/images/background.jpg'),
    // require('../assets/images/restaurant-placeholder.png'),
];

export const useAppLoading = () => {
    const [loadingState, setLoadingState] = useState<LoadingState>({
        isLoading: true,
        progress: 0,
        loadingText: "Загружаем приложение...",
    });

    const preloadImages = useCallback(async () => {
        const totalImages = IMAGES_TO_PRELOAD.length;
        if (totalImages === 0) {
            setLoadingState((prev) => ({ ...prev, progress: 100 }));
            return;
        }

        try {
            setLoadingState((prev) => ({
                ...prev,
                loadingText: `Загружаем изображения... 0/${totalImages}`,
            }));

            const results = await preloadLocalImages(IMAGES_TO_PRELOAD);

            let successCount = 0;
            results.forEach((result, index) => {
                if (result.success) {
                    successCount++;
                } else {
                    console.warn(
                        `Не удалось загрузить изображение ${index}:`,
                        result.error
                    );
                }

                const progress = Math.round(((index + 1) / totalImages) * 100);
                setLoadingState((prev) => ({
                    ...prev,
                    progress,
                    loadingText: `Загружаем изображения... ${
                        index + 1
                    }/${totalImages}`,
                }));
            });

            console.log(
                `Предзагружено ${successCount}/${totalImages} изображений`
            );
        } catch (error) {
            console.error("Ошибка предзагрузки изображений:", error);
        }
    }, []);

    const simulateLoading = useCallback(async () => {
        // Минимальное время показа анимации (чтобы пользователь успел её увидеть)
        const minLoadingTime = 2000;
        const startTime = Date.now();

        // Имитация загрузки данных
        setLoadingState((prev) => ({
            ...prev,
            loadingText: "Инициализация...",
        }));
        await new Promise((resolve) => setTimeout(resolve, 500));

        setLoadingState((prev) => ({
            ...prev,
            loadingText: "Загружаем данные...",
        }));
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Предзагрузка изображений
        setLoadingState((prev) => ({
            ...prev,
            loadingText: "Загружаем ресурсы...",
        }));
        await preloadImages();

        // Проверяем минимальное время
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minLoadingTime) {
            const remainingTime = minLoadingTime - elapsedTime;
            setLoadingState((prev) => ({
                ...prev,
                loadingText: "Завершение...",
            }));
            await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        // Завершение загрузки
        setLoadingState((prev) => ({
            ...prev,
            progress: 100,
            loadingText: "Готово!",
        }));
        await new Promise((resolve) => setTimeout(resolve, 300));

        setLoadingState((prev) => ({ ...prev, isLoading: false }));
    }, [preloadImages]);

    const startLoading = useCallback(() => {
        setLoadingState({
            isLoading: true,
            progress: 0,
            loadingText: "Загружаем приложение...",
        });
        simulateLoading();
    }, [simulateLoading]);

    const finishLoading = useCallback(() => {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
    }, []);

    useEffect(() => {
        startLoading();
    }, [startLoading]);

    return {
        ...loadingState,
        startLoading,
        finishLoading,
    };
};
