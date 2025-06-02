
import { useState } from "react";
import { PlayerCard } from "@/components/PlayerCard";
import { PlayerFilters } from "@/components/PlayerFilters";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock data для демонстрации
const mockPlayers = [
  {
    id: "1",
    name: "Александр Петров",
    avatar: "/placeholder.svg",
    location: "Москва",
    sport: "Футбол",
    experience: "Любитель",
    teamStatus: "looking" as const,
    age: 25,
    gender: "Мужской"
  },
  {
    id: "2", 
    name: "Елена Сидорова",
    location: "Санкт-Петербург",
    sport: "Волейбол",
    experience: "Полупрофессионал",
    teamStatus: "has-team" as const,
    age: 28,
    gender: "Женский"
  },
  {
    id: "3",
    name: "Дмитрий Козлов",
    location: "Казань",
    sport: "Футбол", 
    experience: "Новичок",
    teamStatus: "looking" as const,
    age: 19,
    gender: "Мужской"
  },
  {
    id: "4",
    name: "Анна Волкова",
    location: "Екатеринбург",
    sport: "Футбол",
    experience: "Профессионал",
    teamStatus: "not-looking" as const,
    age: 32,
    gender: "Женский"
  },
  {
    id: "5",
    name: "Игорь Морозов",
    location: "Новосибирск",
    sport: "Футбол",
    experience: "Любитель",
    teamStatus: "looking" as const,
    age: 22,
    gender: "Мужской"
  },
  {
    id: "6",
    name: "Мария Белова",
    location: "Ростов-на-Дону",
    sport: "Футбол",
    experience: "Полупрофессионал",
    teamStatus: "has-team" as const,
    age: 26,
    gender: "Женский"
  }
];

const FindPlayers = () => {
  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    location: '',
    experience: '',
    teamStatus: [] as string[],
    age: '',
    gender: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const playersPerPage = 6;

  // Фильтрация игроков
  const filteredPlayers = mockPlayers.filter(player => {
    // Для текстовых полей используем частичное совпадение
    const matchesSearch = !filters.search || player.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSport = !filters.sport || player.sport.toLowerCase().includes(filters.sport.toLowerCase());
    const matchesLocation = !filters.location || player.location.toLowerCase().includes(filters.location.toLowerCase());
    
    // Для выпадающих списков используем точное сравнение (кроме случая сброса)
    const matchesExperience = !filters.experience || filters.experience === "all" || player.experience === filters.experience;
    const matchesGender = !filters.gender || filters.gender === "all" || player.gender === filters.gender;
    
    // Для статуса команды проверяем наличие в массиве
    const matchesTeamStatus = filters.teamStatus.length === 0 || filters.teamStatus.includes(player.teamStatus);
    
    // Для возраста преобразуем число в строку для сравнения
    const matchesAge = !filters.age || player.age.toString() === filters.age;
    
    return matchesSearch && matchesSport && matchesLocation && 
           matchesExperience && matchesTeamStatus && matchesAge && matchesGender;
  });

console.log("Filters:", filters);
console.log("Filtered players:", filteredPlayers);

  // Пагинация
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, startIndex + playersPerPage);

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

          {/* Результаты поиска */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Найдено {filteredPlayers.length} игроков
            </p>
          </div>

          {/* Список игроков */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentPlayers.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

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

          {/* Пустое состояние */}
          {filteredPlayers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Игроки не найдены</p>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPlayers;
