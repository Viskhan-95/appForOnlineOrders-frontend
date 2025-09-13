import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorDetails } from "./errorService";

export interface ErrorMetric {
    id: string;
    timestamp: number;
    code: string;
    message: string;
    context?: string;
    statusCode?: number;
    field?: string;
    userId?: string;
    sessionId: string;
    retryCount?: number;
    resolved: boolean;
}

export interface ErrorStats {
    totalErrors: number;
    errorsByCode: Record<string, number>;
    errorsByContext: Record<string, number>;
    errorsByHour: Record<string, number>;
    criticalErrors: number;
    networkErrors: number;
    validationErrors: number;
    lastErrorTime?: number;
}

class MetricsService {
    private static readonly STORAGE_KEY = "error_metrics";
    private static readonly SESSION_KEY = "session_id";
    private static readonly MAX_METRICS = 1000; // Максимум метрик в памяти
    private static readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 часа

    private metrics: ErrorMetric[] = [];
    private sessionId: string = "";
    private cleanupTimer?: NodeJS.Timeout;

    constructor() {
        this.initializeSession();
        this.loadMetrics();
        this.startCleanupTimer();
    }

    private async initializeSession(): Promise<void> {
        try {
            const existingSession = await AsyncStorage.getItem(
                MetricsService.SESSION_KEY
            );

            if (existingSession) {
                this.sessionId = existingSession;
            } else {
                this.sessionId = this.generateSessionId();
                await AsyncStorage.setItem(
                    MetricsService.SESSION_KEY,
                    this.sessionId
                );
            }
        } catch (error) {
            console.warn("Failed to initialize metrics session:", error);
            this.sessionId = this.generateSessionId();
        }
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
    }

    private async loadMetrics(): Promise<void> {
        try {
            const stored = await AsyncStorage.getItem(
                MetricsService.STORAGE_KEY
            );
            if (stored) {
                this.metrics = JSON.parse(stored);
                this.cleanupOldMetrics();
            }
        } catch (error) {
            console.warn("Failed to load error metrics:", error);
            this.metrics = [];
        }
    }

    private async saveMetrics(): Promise<void> {
        try {
            await AsyncStorage.setItem(
                MetricsService.STORAGE_KEY,
                JSON.stringify(this.metrics)
            );
        } catch (error) {
            console.warn("Failed to save error metrics:", error);
        }
    }

    private cleanupOldMetrics(): void {
        const cutoffTime = Date.now() - MetricsService.CLEANUP_INTERVAL;
        this.metrics = this.metrics.filter(
            (metric) => metric.timestamp > cutoffTime
        );
    }

    private startCleanupTimer(): void {
        this.cleanupTimer = setInterval(() => {
            this.cleanupOldMetrics();
            this.saveMetrics();
        }, MetricsService.CLEANUP_INTERVAL);
    }

    /**
     * Записать ошибку в метрики
     */
    async recordError(
        error: ErrorDetails,
        context?: string,
        userId?: string,
        retryCount: number = 0
    ): Promise<string> {
        const metric: ErrorMetric = {
            id: this.generateMetricId(),
            timestamp: Date.now(),
            code: error.code || "UNKNOWN_ERROR",
            message: error.message,
            context,
            statusCode: error.statusCode,
            field: error.field,
            userId,
            sessionId: this.sessionId,
            retryCount,
            resolved: false,
        };

        this.metrics.push(metric);

        // Ограничиваем количество метрик
        if (this.metrics.length > MetricsService.MAX_METRICS) {
            this.metrics = this.metrics.slice(-MetricsService.MAX_METRICS);
        }

        await this.saveMetrics();

        // Логируем критические ошибки
        if (this.isCriticalError(error)) {
            console.error("🚨 Critical Error Recorded:", metric);
        }

        return metric.id;
    }

    /**
     * Отметить ошибку как решенную
     */
    async resolveError(metricId: string): Promise<void> {
        const metric = this.metrics.find((m) => m.id === metricId);
        if (metric) {
            metric.resolved = true;
            await this.saveMetrics();
        }
    }

    /**
     * Получить статистику ошибок
     */
    getErrorStats(timeRange?: number): ErrorStats {
        const cutoffTime = timeRange ? Date.now() - timeRange : 0;
        const filteredMetrics = this.metrics.filter(
            (metric) => metric.timestamp > cutoffTime
        );

        const stats: ErrorStats = {
            totalErrors: filteredMetrics.length,
            errorsByCode: {},
            errorsByContext: {},
            errorsByHour: {},
            criticalErrors: 0,
            networkErrors: 0,
            validationErrors: 0,
            lastErrorTime: undefined,
        };

        filteredMetrics.forEach((metric) => {
            // Подсчет по кодам
            stats.errorsByCode[metric.code] =
                (stats.errorsByCode[metric.code] || 0) + 1;

            // Подсчет по контексту
            if (metric.context) {
                stats.errorsByContext[metric.context] =
                    (stats.errorsByContext[metric.context] || 0) + 1;
            }

            // Подсчет по часам
            const hour = new Date(metric.timestamp).toISOString().slice(0, 13);
            stats.errorsByHour[hour] = (stats.errorsByHour[hour] || 0) + 1;

            // Специальные категории
            if (this.isCriticalError(metric)) {
                stats.criticalErrors++;
            }
            if (metric.code === "NETWORK_ERROR") {
                stats.networkErrors++;
            }
            if (metric.code === "VALIDATION_ERROR") {
                stats.validationErrors++;
            }

            // Последняя ошибка
            if (
                !stats.lastErrorTime ||
                metric.timestamp > stats.lastErrorTime
            ) {
                stats.lastErrorTime = metric.timestamp;
            }
        });

        return stats;
    }

    /**
     * Получить частые ошибки (более threshold раз)
     */
    getFrequentErrors(threshold: number = 3): Array<{
        code: string;
        count: number;
        lastOccurrence: number;
        contexts: string[];
    }> {
        const codeMap = new Map<
            string,
            {
                count: number;
                lastOccurrence: number;
                contexts: Set<string>;
            }
        >();

        this.metrics.forEach((metric) => {
            const existing = codeMap.get(metric.code);
            if (existing) {
                existing.count++;
                existing.lastOccurrence = Math.max(
                    existing.lastOccurrence,
                    metric.timestamp
                );
                if (metric.context) {
                    existing.contexts.add(metric.context);
                }
            } else {
                codeMap.set(metric.code, {
                    count: 1,
                    lastOccurrence: metric.timestamp,
                    contexts: metric.context
                        ? new Set([metric.context])
                        : new Set(),
                });
            }
        });

        return Array.from(codeMap.entries())
            .filter(([, data]) => data.count >= threshold)
            .map(([code, data]) => ({
                code,
                count: data.count,
                lastOccurrence: data.lastOccurrence,
                contexts: Array.from(data.contexts),
            }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Проверить, является ли ошибка критической
     */
    private isCriticalError(error: ErrorDetails | ErrorMetric): boolean {
        const criticalCodes = [
            "INTERNAL_ERROR",
            "DATABASE_ERROR",
            "AUTHENTICATION_FAILED",
            "CRITICAL_SYSTEM_ERROR",
        ];

        const criticalStatusCodes = [500, 502, 503, 504];

        return (
            criticalCodes.includes(error.code || "") ||
            criticalStatusCodes.includes(error.statusCode || 0)
        );
    }

    /**
     * Получить метрики для отправки на сервер (анонимизированные)
     */
    async getMetricsForServer(): Promise<{
        sessionId: string;
        stats: ErrorStats;
        frequentErrors: Array<{
            code: string;
            count: number;
            lastOccurrence: number;
        }>;
        timestamp: number;
    }> {
        const stats = this.getErrorStats();
        const frequentErrors = this.getFrequentErrors(2).map((error) => ({
            code: error.code,
            count: error.count,
            lastOccurrence: error.lastOccurrence,
        }));

        return {
            sessionId: this.sessionId,
            stats,
            frequentErrors,
            timestamp: Date.now(),
        };
    }

    /**
     * Очистить все метрики
     */
    async clearMetrics(): Promise<void> {
        this.metrics = [];
        await AsyncStorage.removeItem(MetricsService.STORAGE_KEY);
    }

    /**
     * Уничтожить сервис
     */
    destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
    }
}

// Экспортируем singleton instance
export const metricsService = new MetricsService();
export default metricsService;
