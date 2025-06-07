import { useState, useEffect } from "react";
import { PlayerCard } from "@/components/PlayerCard";
import { PlayerFilters } from "@/components/PlayerFilters";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast"; // Импортируем useToast
import { playerProfileService, PlayerProfileBackendData, PlayerProfileFilterRequest } from "@/services/playerProfileService";

// Frontend interface для PlayerCard, чтобы отображать данные
interface PlayerCardProps {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  sport: string; // Соответствует 'game' на бэкенде
  experience: string; // Соответствует 'skillLevel' на бэкенде
  teamStatus: "looking" | "has-team" | "not-looking"; // Соответствует 'teamFindingStatus' на бэкенде
  age: number;
  gender: string;
}

// Интерфейс для состояния фильтров на фронтенде
// Включает 'search' и 'experience' как строковые значения для удобства UI,
// которые затем будут преобразованы для бэкенда.
interface FrontendFiltersState {
  search: string; // Для поиска по имени (fullName на бэкенде)
  sport: string; // Для вида спорта (game на бэкенде)
  location: string;
  experience: string; // Строковое представление skillLevel для UI
  teamStatus: string[]; // Массив строк для UI (looking, has-team, not-looking)
  age: string; // Строковое представление возраста для UI
  gender: string; // Строковое представление пола для UI
}

const FindPlayers = () => {
  const { toast } = useToast();

  const [filters, setFilters] = useState<FrontendFiltersState>({
    search: '',
    sport: '',
    location: '',
    experience: 'all', // Изначально выбрано "все"
    teamStatus: [],
    age: '',
    gender: 'all', // Изначально выбрано "все"
  });

  const [players, setPlayers] = useState<PlayerCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const playersPerPage = 6;

  // --- Вспомогательные функции для маппинга данных между фронтендом и бэкендом ---
  const mapSkillLevelToExperience = (skillLevel?: number): string => {
    switch (skillLevel) {
      case 0: return "Новичок";
      case 1: return "Любитель";
      case 2: return "Полупрофессионал";
      case 3: return "Профессионал";
      default: return "Любитель"; // Значение по умолчанию или "Не указано"
    }
  };

  const mapExperienceToSkillLevel = (experience: string): number | undefined => {
    switch (experience) {
      case "Новичок": return 0;
      case "Любитель": return 1;
      case "Полупрофессионал": return 2;
      case "Профессионал": return 3;
      case "all": return undefined; // "all" означает, что фильтр не применен для этого поля
      default: return undefined;
    }
  };

  const mapTeamFindingStatusToFrontend = (status?: number): "looking" | "has-team" | "not-looking" => {
    switch (status) {
      case 0: return "looking";
      case 1: return "has-team";
      case 2: return "not-looking";
      default: return "not-looking"; // Значение по умолчанию
    }
  };

  const mapTeamStatusToBackend = (statusArray: string[]): number | undefined => {
    // Для вашей текущей реализации бэкенда, которая принимает одно значение для teamFindingStatus,
    // мы возьмем только первый выбранный статус или undefined, если массив пуст.
    // Если ваш бэкенд будет поддерживать фильтрацию по нескольким статусам,
    // то потребуется изменить логику здесь и на бэкенде.
    if (statusArray.length === 0) {
        return undefined;
    }
    const status = statusArray[0]; // Берем первый выбранный статус

    switch (status) {
      case "looking": return 0;
      case "has-team": return 1;
      case "not-looking": return 2;
      default: return undefined;
    }
  };
  // --- Конец вспомогательных функций ---


  // Загрузка игроков на основе фильтров
  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        // Сопоставляем значения фильтров фронтенда с форматом запроса бэкенда
        const backendFilters: PlayerProfileFilterRequest = {
          fullName: filters.search.trim() !== '' ? filters.search.trim() : undefined, // Если search пустой, отправляем undefined
          game: filters.sport.trim() !== '' ? filters.sport.trim() : undefined, // Если sport пустой, отправляем undefined
          location: filters.location.trim() !== '' ? filters.location.trim() : undefined,
          skillLevel: mapExperienceToSkillLevel(filters.experience),
          teamFindingStatus: mapTeamStatusToBackend(filters.teamStatus),
          // Исправление для возраста: парсим в число, если не пустая строка
          age: filters.age.trim() !== '' ? parseInt(filters.age) : undefined,
          // Исправление для пола: если "all" или пустая строка, отправляем undefined
          gender: filters.gender === "all" || filters.gender.trim() === '' ? undefined : filters.gender,
        };
        
        console.log("Фильтры бэкенда отправлены:", backendFilters); // Отладочная строка

        const data: PlayerProfileBackendData[] = await playerProfileService.searchProfiles(backendFilters);
        
        // Сопоставляем данные бэкенда с форматом PlayerCardProps для фронтенда
        const mappedPlayers: PlayerCardProps[] = data.map(p => ({
          id: p.id,
          name: p.fullName || "Имя не указано",
          avatar: p.photoUrl || "/placeholder.svg",
          location: p.location || "Не указано",
          sport: p.game || "Не указан",
          experience: mapSkillLevelToExperience(p.skillLevel),
          teamStatus: mapTeamFindingStatusToFrontend(p.teamFindingStatus),
          age: p.age || 0, // Убедитесь, что age это число
          gender: p.gender || "Не указан",
        }));

        setPlayers(mappedPlayers);
        setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске/фильтрации
      } catch (error) {
        console.error("Ошибка при загрузке игроков:", error);
        setFetchError("Не удалось загрузить список игроков. Пожалуйста, попробуйте позже.");
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные игроков. Пожалуйста, попробуйте позже.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [filters, toast]); // Перезапускаем эффект при изменении фильтров

  // Логика пагинации
  const totalPages = Math.ceil(players.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const currentPlayers = players.slice(startIndex, startIndex + playersPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Поиск игроков</h1>
        <p className="text-gray-600">Найдите подходящих игроков для вашей команды</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Фильтры - десктоп */}
        <div className="hidden lg:block">
          <PlayerFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Основной контент */}
        <div className="lg:col-span-3">
          {/* Фильтры - мобильный */}
          <div className="lg:hidden mb-6">
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  {isFiltersOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <PlayerFilters filters={filters} onFiltersChange={setFilters} />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-700">Загрузка игроков...</p>
            </div>
          )}

          {fetchError && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">Ошибка: {fetchError}</p>
              <p className="text-gray-400">Пожалуйста, проверьте подключение к сети или попробуйте позже.</p>
            </div>
          )}

          {!isLoading && !fetchError && (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Найдено {players.length} игроков
                </p>
              </div>

              {/* Список игроков */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>

              {/* Пустое состояние */}
              {players.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">Игроки не найдены</p>
                  <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
                </div>
              )}

              {/* Пагинация */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPlayers;