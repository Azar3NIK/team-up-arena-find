// src/services/authService.ts
import { axiosInstance } from './playerProfileService'; // Используем тот же экземпляр axios с withCredentials

const API_BASE_URL = 'https://localhost:7260'; // Базовый URL вашего API

export const authService = {
  /**
   * Выполняет выход из системы, отправляя запрос на эндпоинт /logout.
   * Бэкенд должен удалить http-only cookie.
   */
  logout: async (): Promise<void> => {
    try {
      // Ваш эндпоинт POST /logout ничего не возвращает в теле, но мы ждем успешного статуса 200 OK
      await axiosInstance.post(`${API_BASE_URL}/logout`);
    } catch (error) {
      // Даже если произошла ошибка (например, куки уже нет),
      // мы все равно хотим выйти на клиенте. Логируем ошибку, но не пробрасываем ее дальше.
      console.error("Ошибка при выходе из системы на сервере:", error);
      // В данном случае, мы не будем пробрасывать ошибку, т.к. выход на клиенте 
      // должен произойти в любом случае.
    }
  },
};