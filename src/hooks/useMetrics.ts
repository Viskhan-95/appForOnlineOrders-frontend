import { useState, useEffect, useCallback } from "react";
import metricsService, { ErrorStats } from "../services/metricsService";

export const useMetrics = () => {
    const [stats, setStats] = useState<ErrorStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const refreshStats = useCallback(async (timeRange?: number) => {
        setIsLoading(true);
        try {
            const errorStats = metricsService.getErrorStats(timeRange);
            setStats(errorStats);
        } catch (error) {
            console.warn("Failed to refresh error stats:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getFrequentErrors = useCallback((threshold: number = 3) => {
        return metricsService.getFrequentErrors(threshold);
    }, []);

    const recordError = useCallback(
        async (
            error: any,
            context?: string,
            userId?: string,
            retryCount: number = 0
        ) => {
            try {
                return await metricsService.recordError(
                    error,
                    context,
                    userId,
                    retryCount
                );
            } catch (metricsError) {
                console.warn("Failed to record error:", metricsError);
                return "";
            }
        },
        []
    );

    const resolveError = useCallback(async (errorId: string) => {
        try {
            await metricsService.resolveError(errorId);
        } catch (error) {
            console.warn("Failed to resolve error:", error);
        }
    }, []);

    const clearMetrics = useCallback(async () => {
        try {
            await metricsService.clearMetrics();
            setStats(null);
        } catch (error) {
            console.warn("Failed to clear metrics:", error);
        }
    }, []);

    const getMetricsForServer = useCallback(async () => {
        try {
            return await metricsService.getMetricsForServer();
        } catch (error) {
            console.warn("Failed to get metrics for server:", error);
            return null;
        }
    }, []);

    // Автоматически загружаем статистику при монтировании
    useEffect(() => {
        refreshStats();
    }, [refreshStats]);

    return {
        stats,
        isLoading,
        refreshStats,
        getFrequentErrors,
        recordError,
        resolveError,
        clearMetrics,
        getMetricsForServer,
    };
};

export default useMetrics;
