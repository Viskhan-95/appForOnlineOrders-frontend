import { AxiosError, AxiosRequestConfig } from "axios";

export interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryCondition?: (error: AxiosError) => boolean;
    onRetry?: (attempt: number, error: AxiosError) => void;
}

export interface RetryState {
    attempt: number;
    lastError?: AxiosError;
    isRetrying: boolean;
}

class RetryService {
    private static readonly DEFAULT_CONFIG: RetryConfig = {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
        retryCondition: (error: AxiosError) => {
            // Повторяем только для сетевых ошибок и 5xx ошибок сервера
            return (
                !error.response || // Сетевые ошибки
                (error.response.status >= 500 && error.response.status < 600) || // Серверные ошибки
                error.response.status === 429 // Rate limiting
            );
        },
    };

    /**
     * Выполнить запрос с retry логикой
     */
    static async executeWithRetry<T>(
        requestFn: () => Promise<T>,
        config: Partial<RetryConfig> = {}
    ): Promise<T> {
        const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
        let lastError: AxiosError | undefined;

        for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
            try {
                return await requestFn();
            } catch (error) {
                lastError = error as AxiosError;

                // Если это последняя попытка или ошибка не подходит для retry
                if (
                    attempt === finalConfig.maxRetries ||
                    !finalConfig.retryCondition?.(lastError)
                ) {
                    throw lastError;
                }

                // Вызываем callback перед retry
                if (finalConfig.onRetry) {
                    finalConfig.onRetry(attempt + 1, lastError);
                }

                // Вычисляем задержку с экспоненциальным backoff
                const delay = this.calculateDelay(attempt, finalConfig);

                // Ждем перед следующей попыткой
                await this.sleep(delay);
            }
        }

        throw lastError;
    }

    /**
     * Создать retry interceptor для Axios
     */
    static createRetryInterceptor(config: Partial<RetryConfig> = {}) {
        const finalConfig = { ...this.DEFAULT_CONFIG, ...config };

        return {
            onFulfilled: (response: any) => response,
            onRejected: async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & {
                    _retryCount?: number;
                };

                // Инициализируем счетчик попыток
                if (!originalRequest._retryCount) {
                    originalRequest._retryCount = 0;
                }

                // Проверяем, нужно ли повторить запрос
                if (
                    originalRequest._retryCount < finalConfig.maxRetries &&
                    finalConfig.retryCondition?.(error)
                ) {
                    originalRequest._retryCount++;

                    // Вызываем callback
                    if (finalConfig.onRetry) {
                        finalConfig.onRetry(originalRequest._retryCount, error);
                    }

                    // Вычисляем задержку
                    const delay = this.calculateDelay(
                        originalRequest._retryCount - 1,
                        finalConfig
                    );

                    // Ждем и повторяем запрос
                    await this.sleep(delay);

                    // Возвращаем Promise для повторного выполнения
                    return new Promise((resolve) => {
                        resolve(error.config);
                    });
                }

                return Promise.reject(error);
            },
        };
    }

    /**
     * Вычислить задержку с jitter для избежания thundering herd
     */
    private static calculateDelay(
        attempt: number,
        config: RetryConfig
    ): number {
        const exponentialDelay =
            config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
        const cappedDelay = Math.min(exponentialDelay, config.maxDelay);

        // Добавляем jitter (±25% от задержки)
        const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);

        return Math.max(0, cappedDelay + jitter);
    }

    /**
     * Утилита для задержки
     */
    private static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Проверить, стоит ли повторить запрос для конкретной ошибки
     */
    static shouldRetry(
        error: AxiosError,
        customCondition?: (error: AxiosError) => boolean
    ): boolean {
        if (customCondition) {
            return customCondition(error);
        }

        return this.DEFAULT_CONFIG.retryCondition!(error);
    }

    /**
     * Получить рекомендуемую конфигурацию для разных типов запросов
     */
    static getConfigForRequestType(
        type: "critical" | "normal" | "background"
    ): RetryConfig {
        switch (type) {
            case "critical":
                return {
                    maxRetries: 5,
                    baseDelay: 500,
                    maxDelay: 5000,
                    backoffMultiplier: 1.5,
                };
            case "normal":
                return this.DEFAULT_CONFIG;
            case "background":
                return {
                    maxRetries: 2,
                    baseDelay: 2000,
                    maxDelay: 15000,
                    backoffMultiplier: 3,
                };
            default:
                return this.DEFAULT_CONFIG;
        }
    }

    /**
     * Создать retry состояние для отслеживания
     */
    static createRetryState(): RetryState {
        return {
            attempt: 0,
            isRetrying: false,
        };
    }

    /**
     * Обновить retry состояние
     */
    static updateRetryState(
        state: RetryState,
        attempt: number,
        error?: AxiosError
    ): RetryState {
        return {
            attempt,
            lastError: error,
            isRetrying: attempt > 0,
        };
    }
}

export default RetryService;
