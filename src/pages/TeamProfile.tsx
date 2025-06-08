// src/pages/TeamProfile.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Users, Trophy, Mail, Phone, Loader2, ServerCrash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { teamService, TeamData } from "@/services/teamService"; 
import { applicationService } from "@/services/applicationService";

// Вспомогательная функция для маппинга уровня
const mapNumberToLevel = (level: number | null): string => {
    switch (level) {
        case 0: return "Новичок";
        case 1: return "Любитель";
        case 2: return "Полупрофессионал";
        case 3: return "Профессионал";
        default: return "Не указан";
    }
};

const TeamProfile = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id из URL
  const navigate = useNavigate();
  const { toast } = useToast();

  const [team, setTeam] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("ID команды не найден в URL.");
      setIsLoading(false);
      return;
    }

    const fetchTeamData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await teamService.getTeamById(id);
        setTeam(data);
      } catch (err) {
        console.error("Ошибка при загрузке профиля команды:", err);
        setError("Не удалось загрузить профиль команды. Возможно, она была удалена или ссылка неверна.");
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось получить данные команды.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [id, toast]);
  
  const handleApplyToTeam = async () => {
    if (!team) return;

    setIsApplying(true);
    try {
      const response = await applicationService.sendApplication(team.id);
      toast({
        title: "Заявка отправлена!",
        description: `Ваша заявка на вступление в команду "${team.name}" успешно отправлена.`,
      });
      console.log("Заявка создана, ID:", response.applicationId);
    } catch (error: any) {
      // Улучшенная обработка ошибок от сервера
      const errorMessage = error.response?.data || "Не удалось отправить заявку. Попробуйте снова.";
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Состояние ошибки
  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ServerCrash className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Произошла ошибка</h1>
        <p className="text-gray-600 mb-6">{error || "Команда не найдена."}</p>
        <Button onClick={() => navigate('/find-teams')}><ArrowLeft className="h-4 w-4 mr-2" />Вернуться к поиску</Button>
      </div>
    );
  }
  
  // Основной JSX
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Назад</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24 border">
                  <AvatarImage src={team.logoUrl || undefined} alt={team.name} />
                  <AvatarFallback className="text-2xl">{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{team.name}</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2"><Calendar className="h-4 w-4" /><span>Основана в {team.creationYear}</span></div>
                    <div className="flex items-center space-x-2"><Users className="h-4 w-4" /><span>{team.membersCount} игроков</span></div>
                    <div className="flex items-center space-x-2"><Trophy className="h-4 w-4" /><span>Уровень: {mapNumberToLevel(team.teamSkillLevel)}</span></div>
                  </div>
                  <div className="mt-4"><Badge variant="outline">{team.sportType}</Badge></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>О команде</CardTitle></CardHeader>
            <CardContent><p className="text-gray-700 leading-relaxed">{team.aboutTeam || "Описание команды отсутствует."}</p></CardContent>
          </Card>
          
          {/* TODO: Добавить карточки с достижениями и требованиями, если такие поля есть в TeamData */}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Присоединиться к команде</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Команда открыта для новых игроков. Подайте заявку, чтобы присоединиться.</p>
              <Button onClick={handleApplyToTeam} disabled={isApplying} className="w-full">
                 {isApplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Подать заявку"
                )}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Капитан команды</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <h4 className="font-semibold">{team.ownerUserName || "Имя не указано"}</h4>
              {/* TODO: Добавить контакты капитана, если они приходят с бэка */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;