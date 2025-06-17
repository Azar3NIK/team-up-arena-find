// src/context/AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { axiosInstance } from "@/services/playerProfileService"; // Используем общий экземпляр axios
import { basePath } from "@/const";

// Интерфейс для данных пользователя
interface User {
  id: string;
  userName: string;
  email: string;
  // Можно добавить и другие поля, например, role, если они есть
}

// Интерфейс для значения контекста
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Для отслеживания первоначальной загрузки
  login: (userData: User) => void;
  logout: () => void;
}

// Создаем контекст с начальным значением
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Создаем провайдер контекста
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Изначально загружаемся

  // useEffect для проверки аутентификации при загрузке приложения
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Мы предполагаем, что у вас будет такой эндпоинт.
        // Он просто вернет 200 OK и данные пользователя, если кука валидна, или 401, если нет.
        const response = await axiosInstance.get<User>(`${basePath}users/me`);
        setUser(response.data);
      } catch (error) {
        // Если получаем ошибку (например, 401), значит, пользователь не авторизован
        setUser(null);
        console.log("Пользователь не авторизован или сессия истекла.");
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    // Здесь мы только очищаем состояние на клиенте.
    // Фактический запрос на /logout должен быть вызван отдельно перед вызовом этой функции.
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Создаем кастомный хук для удобного использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
