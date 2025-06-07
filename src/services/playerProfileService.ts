// src/services/playerProfileService.ts
import axios from 'axios';

// Базовый URL API. 
const API_BASE_URL = 'https://localhost:7260/playerprofiles'; 

export const axiosInstance = axios.create({
  // ЭТО ВАЖНО: заставляет axios отправлять куки с кросс-доменными запросами
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерфейс для данных профиля, как они приходят с бэкенда
// PlayerProfileResponse.cs на бэкенде
export interface PlayerProfileBackendData {
  id: string; // Guid в C# мапится в string в TS
  skillLevel?: number;
  location?: string;
  teamFindingStatus?: number;
  game?: string;
  playExperienceYears?: number;
  age?: number;
  fullName?: string;
  aboutMe?: string; // соответствует AboutMe на бэкенде
  photoUrl?: string;
  gender?: string;
  height?: number;
  weight?: number;
  phone?: string;
  email?: string;
  telegram?: string;
}

// Интерфейс для данных, отправляемых на бэкенд при обновлении
// UpdatePlayerProfileRequest.cs на бэкенде
export interface UpdatePlayerProfileRequestData {
  id: string; // Guid в C# мапится в string в TS
  skillLevel?: number;
  location?: string;
  teamFindingStatus?: number;
  game?: string;
  playExperienceYears?: number;
  age?: number;
  fullName?: string;
  aboutMe?: string;
  photoUrl?: string;
  achievements?: string;
  gender?: string;
  height?: number;
  weight?: number;
  phone?: string;
  email?: string;
  telegram?: string;
}

// интерфейс для параметров фильтрации, соответствует PlayerProfileFilterRequest на бэкенде
export interface PlayerProfileFilterRequest {
    skillLevel?: number;
    location?: string;
    teamFindingStatus?: number;
    game?: string;
    playExperienceYears?: number;
    age?: number;
    fullName?: string; // Для поиска по имени
    gender?: string;
}

export const playerProfileService = {
  /**
   * Получает профиль игрока по его ID.
   * @param id ID профиля игрока (Guid).
   */
  getProfileById: async (id: string): Promise<PlayerProfileBackendData> => {
    try {
      const response = await axiosInstance.get<PlayerProfileBackendData>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении профиля игрока с ID ${id}:`, error);
      throw error; // Перебрасываем ошибку для обработки в компоненте
    }
  },

  /**
   * Обновляет профиль игрока.
   * @param id ID профиля игрока для обновления.
   * @param data Обновленные данные профиля в формате, ожидаемом бэкендом.
   */
  updateProfile: async (id: string, data: UpdatePlayerProfileRequestData): Promise<string> => {
    try {
      // Отправляем ID как часть URL и в теле запроса, как ожидает ваш UpdatePlayerProfile эндпоинт
      const response = await axiosInstance.put<string>(`${API_BASE_URL}/${id}`, data);
      return response.data; // Ожидаем возвращение ID обновленного профиля
    } catch (error) {
      console.error(`Ошибка при обновлении профиля игрока с ID ${id}:`, error);
      throw error;
    }
  },

   /**
   * Ищет профили игроков по заданным фильтрам.
   * @param filters Объект с параметрами фильтрации.
   */
  searchProfiles: async (filters: PlayerProfileFilterRequest): Promise<PlayerProfileBackendData[]> => {
    try {
      const response = await axiosInstance.get<PlayerProfileBackendData[]>(`${API_BASE_URL}/search`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Ошибка при поиске профилей игроков:', error);
      throw error;
    }
  }
};