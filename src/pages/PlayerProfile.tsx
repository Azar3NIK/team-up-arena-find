// PlayerProfile.tsx

import { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Trophy, Users, MessageCircle, Loader2, ServerCrash } from "lucide-react"; // Иконки
import { useToast } from "@/hooks/use-toast";
import { playerProfileService, PlayerProfileBackendData } from "@/services/playerProfileService"; // сервис анкеты игрока
import { invitationService } from "@/services/invitationService"; 
import { teamService, TeamData } from "@/services/teamService"; 

// Вспомогательные функции для маппинга данных 
const mapSkillLevelToExperience = (skillLevel?: number): string => {
    switch (skillLevel) {
        case 0: return "Новичок";
        case 1: return "Любитель";
        case 2: return "Полупрофессионал";
        case 3: return "Профессионал";
        default: return "Не указано";
    }
};

const mapTeamFindingStatusToFrontend = (status?: number): "looking" | "has-team" | "not-looking" => {
    switch (status) {
        case 0: return "looking";
        case 1: return "has-team";
        case 2: return "not-looking";
        default: return "not-looking";
    }
};

const getTeamStatusBadge = (status: "looking" | "has-team" | "not-looking") => {
    switch (status) {
        case 'looking': return <Badge className="bg-green-500 text-white">Ищет команду</Badge>;
        case 'has-team': return <Badge variant="secondary">В команде</Badge>;
        case 'not-looking': return <Badge variant="outline">Не ищет команду</Badge>;
        default: return null;
    }
};

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id из URL
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [player, setPlayer] = useState<PlayerProfileBackendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [captainTeam, setCaptainTeam] = useState<TeamData | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID игрока не найден в URL.");
      setIsLoading(false);
      return;
    }

    const fetchPlayerProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await playerProfileService.getProfileById(id);
        setPlayer(data);
      } catch (err) {
        console.error("Ошибка при загрузке профиля игрока:", err);
        setError("Не удалось загрузить профиль игрока. Возможно, он был удален или ссылка неверна.");
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось получить данные игрока.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

     const fetchCaptainTeam = async () => {
        try {
            const team = await teamService.getMyTeam();

            setCaptainTeam(team);
        } catch (error) {
            
            console.warn("Не удалось загрузить команду для приглашения:", error);
        }
    };

    fetchCaptainTeam();

    fetchPlayerProfile();
  }, [id, toast]);

    const handleInvitePlayer = async () => {

    console.log("Проверка перед приглашением:", {
            player: player,
            captainTeam: captainTeam,
            isPlayerMissing: !player,
           isTeamMissing: !captainTeam,
           isUserIdMissing: player ? !player.userId : true
        });

    if (!player || !captainTeam || !player.userId) {
        toast({
            title: "Невозможно пригласить",
            description: "Отсутствуют данные игрока или вашей команды.",
            variant: "destructive",
        });
        return;
    }
     setIsInviting(true);
    try {
        await invitationService.sendInvitation({
            teamId: captainTeam.id,
            invitedUserId: player.userId, // ID игрока, чей профиль мы смотрим
        });

        toast({
            title: "Приглашение отправлено",
            description: `Вы успешно пригласили ${player.fullName} в команду "${captainTeam.name}".`,
        });

    } catch (error: any) {
        let errorMessage = "Произошла неизвестная ошибка при отправке приглашения.";
    
    // Проверяем, что это ошибка Axios и есть тело ответа
    if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        // Если тело ответа - строка (как от ваших throw new InvalidOperationException), используем ее
        if (typeof responseData === 'string') {
            errorMessage = responseData;
        } 
        // Если тело ответа - объект ошибки .NET (как при 500), берем из него поле detail или title
        else if (typeof responseData === 'object' && responseData.detail) {
            errorMessage = responseData.detail;
        }
        else if (typeof responseData === 'object' && responseData.title) {
            errorMessage = responseData.title;
        }
    }

    toast({
        title: "Ошибка",
        description: errorMessage, 
        variant: "destructive",
    });
    console.error(error); 
    } finally {
        setIsInviting(false);
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
  if (error || !player) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ServerCrash className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Произошла ошибка</h1>
        <p className="text-gray-600 mb-6">{error || "Игрок не найден."}</p>
        <Button onClick={() => navigate('/find-players')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Вернуться к поиску
        </Button>
      </div>
    );
  }

  // Состояние успешной загрузки
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад к поиску
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-24 w-24 border">
                  <AvatarImage src={player.photoUrl || undefined} alt={player.fullName} />
                  <AvatarFallback className="text-3xl">
                    {player.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{player.fullName}</h1>
                  <div className="flex items-center space-x-1 text-gray-600 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{player.location || "Местоположение не указано"}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline">{player.game || "Спорт не указан"}</Badge>
                    <Badge variant="outline">{mapSkillLevelToExperience(player.skillLevel)}</Badge>
                    {getTeamStatusBadge(mapTeamFindingStatusToFrontend(player.teamFindingStatus))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="font-bold text-xl">{player.age || "-"}</div>
                  <div className="text-sm text-gray-500">Возраст</div>
                </div>
                <div>
                  <div className="font-bold text-xl">{player.playExperienceYears || "-"}</div>
                  <div className="text-sm text-gray-500">Стаж (лет)</div>
                </div>
                <div>
                  <div className="font-bold text-xl">{player.height || "-"} см</div>
                  <div className="text-sm text-gray-500">Рост</div>
                </div>
                <div>
                  <div className="font-bold text-xl">{player.weight || "-"} кг</div>
                  <div className="text-sm text-gray-500">Вес</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>О себе</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {player.aboutMe || "Игрок пока не добавил информацию о себе."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Действия</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {captainTeam && player.teamFindingStatus === 0 && (
              <Button 
                className="w-full" 
                onClick={handleInvitePlayer} 
                disabled={isInviting}
              >
                {isInviting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Отправка...</>
                ) : (
                  <><Users className="h-4 w-4 mr-2" /> Пригласить в команду</>
                )}
              </Button>
              )}
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Написать сообщение
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Контакты</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Email:</strong> {player.email || "не указан"}</p>
              <p><strong>Телефон:</strong> {player.phone || "не указан"}</p>
              <p><strong>Telegram:</strong> {player.telegram || "не указан"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;