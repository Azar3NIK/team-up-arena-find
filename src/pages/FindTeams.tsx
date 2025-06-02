
import { useState } from "react";
import { TeamCard } from "@/components/TeamCard";
import { TeamFilters } from "@/components/TeamFilters";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock data для демонстрации
const mockTeams = [
  {
    id: "1",
    name: "Спартак Москва",
    logo: "/placeholder.svg",
    location: "Москва",
    sport: "Футбол",
    level: "Профессионал",
    foundedYear: 2018,
    membersCount: 18,
    maxMembers: 25,
    description: "Профессиональная футбольная команда, участвует в городских турнирах. Ищем талантливых игроков для усиления состава."
  },
  {
    id: "2",
    name: "Волейбольный клуб Динамо",
    location: "Санкт-Петербург",
    sport: "Волейбол",
    level: "Полупрофессионал",
    foundedYear: 2020,
    membersCount: 12,
    maxMembers: 15,
    isRecruiting: true,
    description: "Дружная команда волейболистов. Тренируемся 3 раза в неделю, участвуем в региональных соревнованиях."
  },
  {
    id: "3",
    name: "ФК Казань",
    location: "Казань",
    sport: "Футбол",
    level: "Любитель",
    foundedYear: 2019,
    membersCount: 15,
    maxMembers: 22,
    description: "Любительская футбольная команда для активного отдыха и поддержания формы."
  },
  {
    id: "4",
    name: "Уральские Медведи",
    location: "Екатеринбург",
    sport: "Хоккей",
    level: "Полупрофессионал",
    foundedYear: 2015,
    membersCount: 20,
    maxMembers: 25,
    description: "Хоккейная команда с богатыми традициями. Играем в местной лиге, стремимся к победам."
  },
  {
    id: "5",
    name: "Сибирские Тигры",
    location: "Новосибирск",
    sport: "Баскетбол",
    level: "Любитель",
    foundedYear: 2021,
    membersCount: 10,
    maxMembers: 12,
    description: "Молодая баскетбольная команда, приглашаем новых игроков для совместных тренировок и игр."
  },
  {
    id: "6",
    name: "Ростовские Орлы",
    location: "Ростов-на-Дону",
    sport: "Футбол",
    level: "Полупрофессионал",
    foundedYear: 2017,
    membersCount: 22,
    maxMembers: 25,
    description: "Стабильная команда с хорошими результатами в региональных турнирах."
  }
];

const FindTeams = () => {
  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    location: '',
    level: '',
    foundedYear: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const teamsPerPage = 6;

  // Фильтрация команд
  const filteredTeams = mockTeams.filter(team => {
    const matchesSearch = !filters.search || team.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSport = !filters.sport || team.sport.toLowerCase().includes(filters.sport.toLowerCase());
    const matchesLocation = !filters.location || team.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesLevel = !filters.level || filters.level === "all" || team.level === filters.level;
    const matchesYear = !filters.foundedYear || team.foundedYear.toString() === filters.foundedYear;
    
    return matchesSearch && matchesSport && matchesLocation && 
           matchesLevel && matchesYear;
  });

  console.log("Team Filters:", filters);
  console.log("Filtered teams:", filteredTeams);

  // Пагинация
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);
  const startIndex = (currentPage - 1) * teamsPerPage;
  const currentTeams = filteredTeams.slice(startIndex, startIndex + teamsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Поиск команд</h1>
        <p className="text-gray-600">Найдите подходящую команду для участия</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Фильтры - десктоп */}
        <div className="hidden lg:block">
          <TeamFilters filters={filters} onFiltersChange={setFilters} />
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
                <TeamFilters filters={filters} onFiltersChange={setFilters} />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Результаты поиска */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Найдено {filteredTeams.length} команд
            </p>
          </div>

          {/* Список команд */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentTeams.map(team => (
              <TeamCard key={team.id} team={team} />
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
          {filteredTeams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Команды не найдены</p>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindTeams;
