import { Image } from "react-native";

export interface ImagePreloadResult {
    success: boolean;
    error?: string;
    uri: string;
}

export class ImagePreloader {
    private static instance: ImagePreloader;
    private preloadedImages: Set<string> = new Set();
    private preloadPromises: Map<string, Promise<ImagePreloadResult>> =
        new Map();

    static getInstance(): ImagePreloader {
        if (!ImagePreloader.instance) {
            ImagePreloader.instance = new ImagePreloader();
        }
        return ImagePreloader.instance;
    }

    /**
     * Предзагружает одно изображение
     */
    async preloadImage(uri: string): Promise<ImagePreloadResult> {
        if (this.preloadedImages.has(uri)) {
            return { success: true, uri };
        }

        if (this.preloadPromises.has(uri)) {
            return this.preloadPromises.get(uri)!;
        }

        const promise = this.loadImage(uri);
        this.preloadPromises.set(uri, promise);

        const result = await promise;
        if (result.success) {
            this.preloadedImages.add(uri);
        }

        this.preloadPromises.delete(uri);
        return result;
    }

    /**
     * Предзагружает массив изображений
     */
    async preloadImages(uris: string[]): Promise<ImagePreloadResult[]> {
        const promises = uris.map((uri) => this.preloadImage(uri));
        return Promise.all(promises);
    }

    /**
     * Предзагружает изображения из require()
     */
    async preloadLocalImages(sources: any[]): Promise<ImagePreloadResult[]> {
        const uris = sources.map((source) => {
            const resolved = Image.resolveAssetSource(source);
            return resolved.uri;
        });
        return this.preloadImages(uris);
    }

    /**
     * Проверяет, загружено ли изображение
     */
    isPreloaded(uri: string): boolean {
        return this.preloadedImages.has(uri);
    }

    /**
     * Очищает кэш предзагруженных изображений
     */
    clearCache(): void {
        this.preloadedImages.clear();
        this.preloadPromises.clear();
    }

    private async loadImage(uri: string): Promise<ImagePreloadResult> {
        try {
            await Image.prefetch(uri);
            return { success: true, uri };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
                uri,
            };
        }
    }
}

// Экспорт синглтона
export const imagePreloader = ImagePreloader.getInstance();

// Утилитарные функции
export const preloadImage = (uri: string) => imagePreloader.preloadImage(uri);
export const preloadImages = (uris: string[]) =>
    imagePreloader.preloadImages(uris);
export const preloadLocalImages = (sources: any[]) =>
    imagePreloader.preloadLocalImages(sources);
