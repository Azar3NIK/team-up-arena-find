// src/pages/FindTeams.tsx

import { useState, useEffect } from "react";
import { TeamCard } from "@/components/TeamCard";
import { TeamFilters } from "@/components/TeamFilters";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, SearchX, ArrowLeft } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { teamService, TeamData, TeamSearchFilters } from "@/services/teamService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Вспомогательные функции для маппинга
const mapLevelToNumber = (level: string): number | undefined => {
  switch (level) {
    case "Новичок": return 0;
    case "Любитель": return 1;
    case "Полупрофессионал": return 2;
    case "Профессионал": return 3;
    default: return undefined;
  }
};
const mapNumberToLevel = (level: number | null): string => {
  switch (level) {
    case 0: return "Новичок";
    case 1: return "Любитель";
    case 2: return "Полупрофессионал";
    case 3: return "Профессионал";
    default: return "Не указан";
  }
};

// Состояние фильтров в UI
interface FiltersState {
  name: string;
  sportType: string;
  skillLevel: string;
}

const FindTeams = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersState>({
    name: '',
    sportType: '',
    skillLevel: 'all',
  });
  
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 6;

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const backendFilters: TeamSearchFilters = {
          name: filters.name || undefined,
          sportType: filters.sportType || undefined,
          skillLevel: mapLevelToNumber(filters.skillLevel),
        };
        const data = await teamService.searchTeams(backendFilters);
        setTeams(data);
        setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список команд.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchTeams();
    }, 500);

    return () => clearTimeout(handler);
  }, [filters, toast]);

  // Пагинация
  const totalPages = Math.ceil(teams.length / teamsPerPage);
  const startIndex = (currentPage - 1) * teamsPerPage;
  const currentTeams = teams.slice(startIndex, startIndex + teamsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          К дашборду
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Поиск команд</h1>
        <p className="text-gray-600">Найдите подходящую команду для участия</p>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Поиск команд</h1>
        <p className="text-gray-600">Найдите подходящую команду для участия</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block">
          <TeamFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="lg:col-span-3">
          <div className="lg:hidden mb-6">
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild><Button variant="outline" className="w-full"><Filter className="h-4 w-4 mr-2" />{isFiltersOpen ? 'Скрыть фильтры' : 'Показать фильтры'}</Button></CollapsibleTrigger>
              <CollapsibleContent className="mt-4"><TeamFilters filters={filters} onFiltersChange={setFilters} /></CollapsibleContent>
            </Collapsible>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
          ) : (
            <>
              <div className="mb-6"><p className="text-sm text-gray-600">Найдено {teams.length} команд</p></div>

              {teams.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                    {currentTeams.map(team => (
                      <TeamCard key={team.id} team={{
                        id: team.id,
                        name: team.name,
                        logo: team.logoUrl,
                        sport: team.sportType,
                        level: mapNumberToLevel(team.teamSkillLevel),
                        membersCount: team.membersCount,
                      }} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}/></PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <PaginationItem key={page}><PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(page); }} isActive={page === currentPage}>{page}</PaginationLink></PaginationItem>
                        ))}
                        <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}/></PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                  <SearchX className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Команды не найдены</h3>
                  <p className="mt-1 text-sm text-gray-500">Попробуйте изменить параметры поиска или сбросить фильтры.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindTeams;