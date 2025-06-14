// invitationService.ts
import { axiosInstance } from "./playerProfileService";

const API_BASE_URL = "https://localhost:7260/invitations";

// Интерфейс для данных, которые приходят с бэкенда
// Соответствует вашему TeamInvitationResponse.cs
export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  invitedUserId: string;
  invitedUserName: string;
  senderUserId: string;
  senderUserName: string;
  senderPlayerProfileId: string | null;
  invitationDate: string; // Дата приходит как строка
  status: number; // 0: Pending, 1: Accepted, 2: Declined
}

// Интерфейс для отправки приглашения
// Соответствует SendInvitationRequest.cs
export interface SendInvitationData {
  teamId: string;
  invitedUserId: string;
}

// Интерфейс для ответа на приглашение
// Соответствует RespondToInvitationRequest.cs
export interface RespondToInvitationData {
  accept: boolean;
}

export const invitationService = {
  /**
   * Получает все ожидающие приглашения для текущего пользователя.
   */
  getPendingInvitations: async (): Promise<TeamInvitation[]> => {
    try {
      const response = await axiosInstance.get<TeamInvitation[]>(
        `${API_BASE_URL}/pending`
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении ожидающих приглашений:", error);
      throw error;
    }
  },

  /**
   * Отправляет приглашение игроку в команду.
   * @param data Данные для отправки приглашения.
   */
  sendInvitation: async (
    data: SendInvitationData
  ): Promise<{ invitationId: string }> => {
    try {
      const response = await axiosInstance.post<{ invitationId: string }>(
        `${API_BASE_URL}/send`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при отправке приглашения:", error);
      throw error;
    }
  },

  /**
   * Отвечает на приглашение (принять или отклонить).
   * @param invitationId ID приглашения.
   * @param data Данные ответа.
   */
  respondToInvitation: async (
    invitationId: string,
    data: RespondToInvitationData
  ): Promise<string> => {
    try {
      const response = await axiosInstance.post<string>(
        `${API_BASE_URL}/${invitationId}/respond`,
        data
      );
      return response.data; // Ожидаем сообщение об успехе
    } catch (error) {
      console.error("Ошибка при ответе на приглашение:", error);
      throw error;
    }
  },
};
