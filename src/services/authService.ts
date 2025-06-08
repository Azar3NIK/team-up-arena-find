// src/services/authService.ts
import { axiosInstance } from './playerProfileService';

const API_BASE_URL = 'https://localhost:7260'; // Базовый URL API

export const authService = {
  /**
   * Выполняет выход из системы, отправляя запрос на эндпоинт /logout.
   * Бэкенд должен удалить http-only cookie.
   */
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(`${API_BASE_URL}/logout`);
    } catch (error) {

      console.error("Ошибка при выходе из системы на сервере:", error);

    }
  },
};