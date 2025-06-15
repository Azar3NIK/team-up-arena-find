// src/services/teamService.ts
import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
});

const API_BASE_URL = "https://localhost:7260/team";

export interface UpdateTeamData {
  name: string;
  sportType: string | null;
  logoUrl?: string | null; // Опционально, т.к. мы его не редактируем
  creationYear: number;
  teamSkillLevel: number;
  aboutTeam: string | null;
}

export interface MemberData {
  id: string;
  userName: string;
  email: string;
}

// Интерфейс для ответа от эндпоинта /team/my или /team/{id}
// Соответствует TeamResponse.cs
export interface TeamData {
  id: string;
  name: string;
  sportType: string;
  logoUrl: string | null;
  creationYear: number;
  teamSkillLevel: number | null; // 0: Новичок, 1: Любитель, 2: Полупроф, 3: Проф
  aboutTeam: string;
  ownerUserId: string;
  ownerUserName: string;
  membersCount: number;
  members: MemberData[];
}

// Интерфейс для фильтров, отправляемых на бэкенд
export interface TeamSearchFilters {
  name?: string;
  sportType?: string;
  skillLevel?: number;
}

// Интерфейс для создания команды
// Соответствует CreateTeamRequest.cs
export interface CreateTeamData {
  name: string;
  sportType: string;
  logoUrl: string | null;
  creationYear: number;
  teamSkillLevel: number;
  aboutTeam: string;
}

export const teamService = {
  /**
   * Получает команду текущего пользователя.
   * Возвращает данные команды, если она найдена.
   * Возвращает null, если бэкенд ответил 404 (команда не найдена).
   * Пробрасывает другие ошибки.
   */
  getMyTeam: async (): Promise<TeamData | null> => {
    try {
      const response = await axiosInstance.get<TeamData>(`${API_BASE_URL}/my`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // 404 означает, что команда не найдена, это ожидаемое поведение
        return null;
      }
      console.error("Ошибка при получении данных о команде:", error);
      throw error;
    }
  },

  /**
   * Создает новую команду.
   * @param data Данные для создания команды.
   * @returns ID созданной команды.
   */
  createTeam: async (data: CreateTeamData): Promise<string> => {
    try {
      const response = await axiosInstance.post<string>(API_BASE_URL, data);
      return response.data; // Бэкенд возвращает Guid (string)
    } catch (error) {
      console.error("Ошибка при создании команды:", error);
      throw error;
    }
  },
  /**
   * Покинуть команду (для обычного участника).
   */
  leaveTeam: async (): Promise<string> => {
    try {
      const response = await axiosInstance.post<string>(
        `${API_BASE_URL}/leave`
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при выходе из команды:", error);
      throw error;
    }
  },

  /**
   * Исключить участника из команды (для капитана).
   * @param teamId ID команды.
   * @param memberId ID участника для исключения.
   */
  removeMember: async (teamId: string, memberId: string): Promise<string> => {
    try {
      const response = await axiosInstance.post<string>(
        `${API_BASE_URL}/${teamId}/remove-member/${memberId}`
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при исключении участника:", error);
      throw error;
    }
  },
  searchTeams: async (filters: TeamSearchFilters): Promise<TeamData[]> => {
    try {
      const response = await axiosInstance.get<TeamData[]>(
        `${API_BASE_URL}/search`,
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при поиске команд:", error);
      throw error;
    }
  },

  /**
   * Получает детальную информацию о команде по ее ID.
   * @param id ID команды.
   */
  getTeamById: async (id: string): Promise<TeamData> => {
    try {
      const response = await axiosInstance.get<TeamData>(
        `${API_BASE_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении команды с ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Обновляет данные команды.
   * @param id ID команды для обновления.
   * @param data Обновленные данные.
   */
  updateTeam: async (id: string, data: UpdateTeamData): Promise<string> => {
    try {
      const response = await axiosInstance.put<string>(
        `${API_BASE_URL}/${id}`,
        data
      );
      return response.data; // Ожидаем ID обновленной команды
    } catch (error) {
      console.error(`Ошибка при обновлении команды ${id}:`, error);
      throw error;
    }
  },

  /**
   * Удаляет команду.
   * @param id ID команды для удаления.
   */
  deleteTeam: async (id: string): Promise<string> => {
    try {
      const response = await axiosInstance.delete<string>(
        `${API_BASE_URL}/${id}`
      );
      return response.data; // Ожидаем ID удаленной команды
    } catch (error) {
      console.error(`Ошибка при удалении команды ${id}:`, error);
      throw error;
    }
  },
};
