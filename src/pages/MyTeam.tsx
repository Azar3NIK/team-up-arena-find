
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Trophy, 
  UserMinus, 
  Settings,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data для демонстрации
const mockTeamData = {
  team: {
    id: "1",
    name: "Спартак Москва",
    logo: "/placeholder.svg",
    location: "Москва",
    sport: "Футбол",
    level: "Профессионал",
    foundedYear: 2018,
    description: "Профессиональная футбольная команда, участвует в городских турнирах.",
    stadium: "Стадион Лужники, поле №3",
    trainings: "Вторник, Четверг, Суббота - 19:00"
  },
  currentUser: {
    id: "user1",
    role: "captain" // или "member"
  },
  members: [
    {
      id: "user1",
      name: "Александр Петров",
      avatar: "/placeholder.svg",
      position: "Вратарь",
      joinDate: "2023-01-15",
      role: "captain"
    },
    {
      id: "user2",
      name: "Михаил Иванов",
      avatar: "/placeholder.svg",
      position: "Защитник",
      joinDate: "2023-02-20",
      role: "member"
    },
    {
      id: "user3",
      name: "Дмитрий Сидоров",
      avatar: "/placeholder.svg",
      position: "Полузащитник",
      joinDate: "2023-03-10",
      role: "member"
    },
    {
      id: "user4",
      name: "Сергей Козлов",
      avatar: "/placeholder.svg",
      position: "Нападающий",
      joinDate: "2023-04-05",
      role: "member"
    }
  ]
};

const MyTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamData, setTeamData] = useState(mockTeamData);
  
  const isCaptain = teamData.currentUser.role === "captain";

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (memberId === teamData.currentUser.id) {
      toast({
        title: "Ошибка",
        description: "Вы не можете исключить самого себя из команды.",
        variant: "destructive"
      });
      return;
    }

    setTeamData(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== memberId)
    }));

    toast({
      title: "Игрок исключен",
      description: `${memberName} был исключен из команды.`
    });
  };

  const handleLeaveTeam = () => {
    toast({
      title: "Покинули команду",
      description: "Вы покинули команду. Возвращаемся на главную страницу.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок с кнопкой назад */}
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
        {/* Основная информация о команде */}
        <div className="lg:col-span-2 space-y-6">
          {/* Главная карточка команды */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={teamData.team.logo} alt={teamData.team.name} />
                  <AvatarFallback className="text-2xl">
                    {teamData.team.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">{teamData.team.name}</h1>
                    {isCaptain && (
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Настройки команды
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{teamData.team.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Основана в {teamData.team.foundedYear}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{teamData.members.length} игроков</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>Уровень: {teamData.team.level}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Badge variant="outline" className="mr-2">{teamData.team.sport}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Описание команды */}
          <Card>
            <CardHeader>
              <CardTitle>О команде</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{teamData.team.description}</p>
            </CardContent>
          </Card>

          {/* Состав команды */}
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
                    <TableHead>Позиция</TableHead>
                    <TableHead>Дата вступления</TableHead>
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
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>
                        {new Date(member.joinDate).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {member.role === 'captain' && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="capitalize">
                            {member.role === 'captain' ? 'Капитан' : 'Игрок'}
                          </span>
                        </div>
                      </TableCell>
                      {isCaptain && (
                        <TableCell>
                          {member.role !== 'captain' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id, member.name)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Исключить
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Информация о тренировках */}
          <Card>
            <CardHeader>
              <CardTitle>Расписание тренировок</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">{teamData.team.trainings}</p>
              <p className="text-sm text-gray-600">{teamData.team.stadium}</p>
            </CardContent>
          </Card>

          {/* Статистика команды */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Всего игроков:</span>
                <span className="font-semibold">{teamData.members.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Лет существования:</span>
                <span className="font-semibold">
                  {new Date().getFullYear() - teamData.team.foundedYear}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Действия */}
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isCaptain ? (
                <>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Пригласить игроков
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Настройки команды
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={handleLeaveTeam}
                >
                  Покинуть команду
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
