// trainingService.ts
import { axiosInstance } from './playerProfileService'; 

const API_BASE_URL = 'https://localhost:7260/trainings';

// Интерфейс для данных тренировки, которые приходят с бэкенда
// Соответствует TrainingResponse.cs
export interface TrainingData {
  id: string;
  name: string;
  dateTime: string; // Дата приходит как строка в формате ISO 8601
  durationInMinutes: number;
  location: string;
  description: string | null;
  isCompleted: boolean;
}

// Интерфейс для данных, отправляемых на бэкенд для создания тренировки
// Соответствует CreateTrainingRequest.cs
export interface CreateTrainingData {
  name: string;
  dateTime: string; // Отправляем как строку в формате ISO 8601
  durationInMinutes: number;
  location: string;
  description?: string;
}

export const trainingService = {
  /**
   * Создает новую тренировку.
   */
  createTraining: async (data: CreateTrainingData): Promise<{ trainingId: string }> => {
    try {
      const response = await axiosInstance.post<{ trainingId: string }>(`${API_BASE_URL}`, data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании тренировки:", error);
      throw error;
    }
  },

  /**
   * Получает все тренировки для команды текущего пользователя.
   */
  getMyTeamTrainings: async (): Promise<TrainingData[]> => {
    try {
      const response = await axiosInstance.get<TrainingData[]>(`${API_BASE_URL}/my-team`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении тренировок:", error);
      throw error;
    }
  },
  
  /**
   * Помечает тренировку как завершенную.
   * @param id ID тренировки.
   */
  completeTraining: async (id: string): Promise<string> => {
    try {
      const response = await axiosInstance.post<string>(`${API_BASE_URL}/${id}/complete`);
      return response.data; // Ожидаем сообщение об успехе
    } catch (error) {
        console.error("Ошибка при завершении тренировки:", error);
        throw error;
    }
  },
};