// src/services/fileService.ts
import { axiosInstance } from './playerProfileService';

const API_BASE_URL = 'https://localhost:7260/api/files';

export const fileService = {
  /**
   * Загружает файл на сервер.
   * @param file Файл для загрузки.
   * @returns URL загруженного файла.
   */
  uploadFile: async (file: File): Promise<string> => {
    // Для загрузки файлов используется FormData
    const formData = new FormData();
    formData.append('file', file); // 'file' должно совпадать с именем параметра на бэкенде

    try {
      const response = await axiosInstance.post<{ url: string }>(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Важный заголовок для отправки файлов
        },
      });
      return response.data.url;
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      throw error;
    }
  },
};