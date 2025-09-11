import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { restoreAuthSession } = useAuth();

    useEffect(() => {
        // Восстанавливаем сессию при запуске приложения
        restoreAuthSession();
    }, [restoreAuthSession]);

    return <>{children}</>;
};