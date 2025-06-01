
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Star, Calendar, Trophy, Users, MessageCircle } from "lucide-react";

// Mock data для демонстрации
const mockPlayerData = {
  "1": {
    id: "1",
    name: "Александр Петров",
    avatar: "/placeholder.svg",
    position: "Нападающий",
    rating: 4.5,
    location: "Москва",
    sport: "Футбол",
    experience: "Любитель",
    teamStatus: "looking",
    age: 28,
    height: 180,
    weight: 75,
    joinDate: "2023-06-15",
    gamesPlayed: 45,
    goals: 23,
    assists: 12,
    description: "Опытный нападающий с отличным чувством мяча. Играю в футбол уже 15 лет, участвовал в различных любительских турнирах. Ищу активную команду для участия в чемпионате города.",
    achievements: [
      "Лучший бомбардир турнира 2023",
      "Победитель кубка любительских команд",
      "Участник сборной района"
    ],
    availableTime: ["Понедельник 18:00-20:00", "Среда 19:00-21:00", "Суббота 10:00-12:00"],
    contacts: {
      phone: "+7 (999) 123-45-67",
      email: "alexander.petrov@email.com",
      telegram: "@alex_petrov"
    }
  }
};

const PlayerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const player = mockPlayerData[id as keyof typeof mockPlayerData];

  if (!player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Игрок не найден</h1>
          <Button onClick={() => navigate('/find-players')}>
            Вернуться к поиску
          </Button>
        </div>
      </div>
    );
  }

  const getTeamStatusBadge = (status: string) => {
    switch (status) {
      case 'looking':
        return <Badge className="bg-green-500">Ищет команду</Badge>;
      case 'has-team':
        return <Badge variant="secondary">В команде</Badge>;
      case 'not-looking':
        return <Badge variant="outline">Не ищет команду</Badge>;
      default:
        return null;
    }
  };

  const handleInviteToTeam = () => {
    // Здесь будет логика приглашения в команду
    setShowInviteDialog(true);
    setTimeout(() => {
      setShowInviteDialog(false);
      alert("Приглашение отправлено!");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Кнопка назад */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/find-players')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад к поиску
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback className="text-lg">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">{player.name}</h1>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold">{player.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span>{player.position}</span>
                      <span>•</span>
                      <span>{player.age} лет</span>
                      <span>•</span>
                      <span>{player.height} см, {player.weight} кг</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{player.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-3">
                      <Badge variant="outline">{player.sport}</Badge>
                      <Badge variant="outline">{player.experience}</Badge>
                      {getTeamStatusBadge(player.teamStatus)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">О себе</h3>
                  <p className="text-gray-600">{player.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{player.gamesPlayed}</div>
                    <div className="text-sm text-gray-600">Игр сыграно</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{player.goals}</div>
                    <div className="text-sm text-gray-600">Голов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{player.assists}</div>
                    <div className="text-sm text-gray-600">Передач</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{player.achievements.length}</div>
                    <div className="text-sm text-gray-600">Достижений</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Достижения */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Достижения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {player.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-sm">
                      {achievement}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Время для тренировок */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Свободное время
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {player.availableTime.map((time, index) => (
                  <li key={index} className="text-gray-600">
                    • {time}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div>
          {/* Действия */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {player.teamStatus === 'looking' && (
                <Button 
                  onClick={handleInviteToTeam} 
                  className="w-full"
                  disabled={showInviteDialog}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {showInviteDialog ? 'Отправляется...' : 'Пригласить в команду'}
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Написать сообщение
              </Button>
            </CardContent>
          </Card>

          {/* Контакты */}
          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Телефон</Label>
                <p className="text-gray-600">{player.contacts.phone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-gray-600">{player.contacts.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Telegram</Label>
                <p className="text-gray-600">{player.contacts.telegram}</p>
              </div>
              <div className="pt-2 text-xs text-gray-500">
                Зарегистрирован: {new Date(player.joinDate).toLocaleDateString('ru-RU')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
