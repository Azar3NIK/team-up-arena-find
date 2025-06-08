// src/services/applicationService.ts

import { axiosInstance } from './playerProfileService'; // Используем общий настроенный экземпляр axios

const API_BASE_URL = 'https://localhost:7260/applications';

// Интерфейс для заявки, которая приходит капитану в уведомления
// Соответствует TeamApplicationResponse.cs
export interface TeamApplicationData {
  id: string;
  teamId: string;
  applicantUserId: string;
  applicantUserName: string;
  applicationDate: string; // Дата приходит как строка
  status: number; // 0: Pending, 1: Accepted, 2: Declined
}

export const applicationService = {
  /**
   * Отправляет заявку от текущего игрока в команду.
   * @param teamId ID команды, в которую подается заявка.
   */
  sendApplication: async (teamId: string): Promise<{ applicationId: string }> => {
    try {
      // Эндпоинт ожидает { "teamId": "..." } в теле запроса
      const response = await axiosInstance.post<{ applicationId: string }>(`${API_BASE_URL}/send`, { teamId });
      return response.data;
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
      throw error; // Пробрасываем ошибку для обработки в компоненте
    }
  },

  /**
   * Получает все ожидающие заявки для команды текущего пользователя (капитана).
   */
  getPendingForMyTeam: async (): Promise<TeamApplicationData[]> => {
    try {
      const response = await axiosInstance.get<TeamApplicationData[]>(`${API_BASE_URL}/pending-for-my-team`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении заявок:", error);
      throw error;
    }
  },

  /**
   * Отвечает на заявку (принять/отклонить).
   * @param applicationId ID заявки.
   * @param accept true для принятия, false для отклонения.
   */
  respondToApplication: async (applicationId: string, accept: boolean): Promise<string> => {
    try {
      // Эндпоинт ожидает { "accept": true/false } в теле запроса
      const response = await axiosInstance.post<string>(`${API_BASE_URL}/${applicationId}/respond`, { accept });
      return response.data; // Ожидаем сообщение об успехе от сервера
    } catch (error) {
      console.error("Ошибка при ответе на заявку:", error);
      throw error;
    }
  },
};