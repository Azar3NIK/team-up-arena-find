// --- Файл: MyTeam.tsx ---

import { useState, useEffect } from "react"; // Добавляем useEffect
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, MapPin, Calendar, Users, Trophy, UserMinus, Settings, Crown, Loader2 } from "lucide-react"; // Добавляем Loader2
import { useToast } from "@/hooks/use-toast";
import { teamService, TeamData } from "@/services/teamService"; // Импортируем сервис и тип

// Вспомогательная функция для маппинга уровня
const mapSkillLevelToText = (level: number) => {
  switch (level) {
    case 0: return "Новичок";
    case 1: return "Любитель";
    case 2: return "Полупрофессионал";
    case 3: return "Профессионал";
    default: return "Не указан";
  }
};

const MyTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const data = await teamService.getMyTeam();
        if (data) {
          setTeamData(data);
        } else {
          // Если данные не пришли, значит команды нет - редирект на создание
          toast({
            title: "Команда не найдена",
            description: "Создайте свою команду, чтобы начать.",
          });
          navigate("/create-team");
        }
      } catch (err) {
        setError("Не удалось загрузить данные команды. Пожалуйста, попробуйте обновить страницу.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [navigate, toast]);
  
  // В реальном приложении ID текущего пользователя нужно брать из контекста авторизации
  // Для примера, предположим, что он есть в teamData.ownerUserId
  // const isCaptain = teamData?.ownerUserId === currentUserId; 
  // Но бэкенд уже ограничивает удаление, так что пока просто проверим по ownerUserId
  // В более сложной системе роль (капитан/участник) должна приходить с бэка.

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl">Загрузка данных команды...</p>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl text-destructive mb-4">{error || "Произошла ошибка"}</h2>
        <Button onClick={() => navigate("/dashboard")}>Вернуться на главную</Button>
      </div>
    );
  }

  const isCaptain = true; // Для демонстрации. В реальности нужно получить ID текущего юзера и сравнить с teamData.ownerUserId

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... остальная часть JSX, адаптированная под новые данные ... */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          На главную
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={teamData.logoUrl || "/placeholder.svg"} alt={teamData.name} />
                  <AvatarFallback className="text-2xl">
                    {teamData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">{teamData.name}</h1>
                    {isCaptain && (
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Настройки команды
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{teamData.members.length} игроков</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>Уровень: {mapSkillLevelToText(teamData.teamSkillLevel)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="mr-2">{teamData.sportType}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>О команде</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{teamData.aboutTeam}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Состав команды ({teamData.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Игрок</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    {isCaptain && <TableHead>Действия</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamData.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{member.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {member.id === teamData.ownerUserId && (<Crown className="h-4 w-4 text-yellow-500" />)}
                          <span className="capitalize">
                            {member.id === teamData.ownerUserId ? 'Капитан' : 'Игрок'}
                          </span>
                        </div>
                      </TableCell>
                      {isCaptain && member.id !== teamData.ownerUserId && (
                        <TableCell>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <UserMinus className="h-4 w-4 mr-1" />
                            Исключить
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {/* ... Боковая панель ... */}
      </div>
    </div>
  );
};

export default MyTeam;