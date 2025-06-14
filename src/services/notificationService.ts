import { axiosInstance } from './playerProfileService'; 

// Определяем базовый URL для нового контроллера
const API_BASE_URL = 'https://localhost:7260/notifications';

// Интерфейс для универсального уведомления, который соответствует NotificationResponse.cs
export interface GenericNotificationData {
  id: string;
  type: number; // Число, соответствующее enum на бэкенде (e.g., 2 для NewTraining)
  message: string;
  relatedEntityId: string | null;
  createdAt: string; // Дата приходит как строка
  isRead: boolean;
}

export const notificationService = {
  /**
   * Получает все непрочитанные универсальные уведомления для текущего пользователя.
   */
  getMyGenericNotifications: async (): Promise<GenericNotificationData[]> => {
    try {
      // Делаем запрос на новый эндпоинт GET /notifications/generic
      const response = await axiosInstance.get<GenericNotificationData[]>(`${API_BASE_URL}/generic`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении универсальных уведомлений:", error);
      // Возвращаем пустой массив в случае ошибки, чтобы не сломать Promise.all на странице уведомлений
      return [];
    }
  },

 /**
   * Удаляет (скрывает) уведомление.
   * @param notificationId ID уведомления.
   */
  dismissNotification: async (notificationId: string): Promise<void> => {
    try {
      // Вызываем DELETE эндпоинт
      await axiosInstance.delete(`${API_BASE_URL}/${notificationId}/dismiss`);
    } catch (error) {
      console.error(`Ошибка при удалении уведомления ${notificationId}:`, error);
      throw error; // Пробрасываем ошибку, чтобы показать toast
    }
  },
};