// --- MyTeam.tsx ---

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Trophy,
  UserMinus,
  Settings,
  Crown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { teamService, TeamData } from "@/services/teamService";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Вспомогательная функция для маппинга уровня
const mapSkillLevelToText = (level: number) => {
  switch (level) {
    case 0:
      return "Новичок";
    case 1:
      return "Любитель";
    case 2:
      return "Полупрофессионал";
    case 3:
      return "Профессионал";
    default:
      return "Не указан";
  }
};

const MyTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("AuthContext user:", user);

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
        setError(
          "Не удалось загрузить данные команды. Пожалуйста, попробуйте обновить страницу."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [navigate, toast]);

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!teamData) return;
    try {
      await teamService.removeMember(teamData.id, memberId);
      setTeamData((prev) =>
        prev
          ? { ...prev, members: prev.members.filter((m) => m.id !== memberId) }
          : null
      );
      toast({
        title: "Участник исключен",
        description: `${memberName} был удален из команды.`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data || "Не удалось исключить участника.",
        variant: "destructive",
      });
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await teamService.leaveTeam();
      toast({ title: "Вы покинули команду" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data || "Не удалось покинуть команду.",
        variant: "destructive",
      });
    }
  };

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
        <h2 className="text-2xl text-destructive mb-4">
          {error || "Произошла ошибка"}
        </h2>
        <Button onClick={() => navigate("/dashboard")}>
          Вернуться на главную
        </Button>
      </div>
    );
  }

  const currentUserId = user?.id;
  const isCaptain =
    !!currentUserId &&
    !!teamData.ownerUserId &&
    teamData.ownerUserId.toLowerCase() === currentUserId.toLowerCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
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
                  <AvatarImage
                    src={teamData.logoUrl || "/placeholder.svg"}
                    alt={teamData.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {teamData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">{teamData.name}</h1>
                    {isCaptain && (
                      // Оборачиваем кнопку в Link
                      <Link to={`/team/${teamData.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Настройки команды
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{teamData.members.length} игроков</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>
                        Уровень: {mapSkillLevelToText(teamData.teamSkillLevel)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="mr-2">
                      {teamData.sportType}
                    </Badge>
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
              <p className="text-gray-700 leading-relaxed">
                {teamData.aboutTeam}
              </p>
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
                    {isCaptain && (
                      <TableHead className="text-right">Действия</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamData.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {member.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {member.id === teamData.ownerUserId && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="capitalize">
                            {member.id === teamData.ownerUserId
                              ? "Капитан"
                              : "Игрок"}
                          </span>
                        </div>
                      </TableCell>
                      {isCaptain && member.id !== currentUserId && (
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Исключить игрока?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Вы уверены, что хотите исключить{" "}
                                  {member.userName} из команды?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleRemoveMember(
                                      member.id,
                                      member.userName
                                    )
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Исключить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isCaptain ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/find-players")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Пригласить игроков
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Покинуть команду
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Покинуть команду?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите выйти из команды "{teamData.name}
                        "?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLeaveTeam}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Покинуть
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
