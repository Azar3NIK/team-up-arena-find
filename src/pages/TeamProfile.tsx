
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Users, Trophy, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock data для демонстрации
const mockTeam = {
  id: "1",
  name: "Спартак Москва",
  logo: "/placeholder.svg",
  location: "Москва",
  sport: "Футбол",
  level: "Профессионал",
  foundedYear: 2018,
  membersCount: 18,
  description: "Профессиональная футбольная команда, участвует в городских турнирах. Ищем талантливых игроков для усиления состава.",
  achievements: [
    "Чемпионы городской лиги 2023",
    "Финалисты Кубка Москвы 2022",
    "3 место в региональном турнире 2021"
  ],
  captain: {
    name: "Александр Петров",
    email: "captain@spartak-moscow.ru",
    phone: "+7 (999) 123-45-67"
  },
  trainings: "Вторник, Четверг, Суббота - 19:00",
  requirements: "Опыт игры от 3 лет, участие в соревнованиях, хорошая физическая форма",
  stadium: "Стадион Лужники, поле №3"
};

const TeamProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyToTeam = async () => {
    setIsApplying(true);
    
    // Имитация отправки заявки
    setTimeout(() => {
      toast({
        title: "Заявка отправлена!",
        description: "Ваша заявка на вступление в команду отправлена капитану. Ожидайте ответа.",
      });
      setIsApplying(false);
    }, 1000);
  };

  const handleContactCaptain = () => {
    toast({
      title: "Контакты скопированы",
      description: "Контактная информация капитана скопирована в буфер обмена.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок с кнопкой назад */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Главная карточка */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={mockTeam.logo} alt={mockTeam.name} />
                  <AvatarFallback className="text-2xl">
                    {mockTeam.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">{mockTeam.name}</h1>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{mockTeam.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Основана в {mockTeam.foundedYear}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{mockTeam.membersCount} игроков</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>Уровень: {mockTeam.level}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Badge variant="outline" className="mr-2">{mockTeam.sport}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Описание */}
          <Card>
            <CardHeader>
              <CardTitle>О команде</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{mockTeam.description}</p>
            </CardContent>
          </Card>

          {/* Достижения */}
          <Card>
            <CardHeader>
              <CardTitle>Достижения</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockTeam.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Дополнительная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Информация для кандидатов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Расписание тренировок:</h4>
                <p className="text-gray-700">{mockTeam.trainings}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Место проведения:</h4>
                <p className="text-gray-700">{mockTeam.stadium}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Требования:</h4>
                <p className="text-gray-700">{mockTeam.requirements}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Действия */}
          {
            <Card>
              <CardHeader>
                <CardTitle>Присоединиться к команде</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Команда открыта для новых игроков. Подайте заявку, чтобы присоединиться.
                </p>
                <Button 
                  onClick={handleApplyToTeam} 
                  disabled={isApplying}
                  className="w-full"
                >
                  {isApplying ? "Отправляется..." : "Подать заявку"}
                </Button>
              </CardContent>
            </Card>
          }

          {/* Контакты капитана */}
          <Card>
            <CardHeader>
              <CardTitle>Контакты капитана</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">{mockTeam.captain.name}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{mockTeam.captain.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{mockTeam.captain.phone}</span>
                </div>
              </div>
              <Button variant="outline" onClick={handleContactCaptain} className="w-full">
                Связаться с капитаном
              </Button>
            </CardContent>
          </Card>

          {/* Статистика */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика команды</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Всего игроков:</span>
                <span className="font-semibold">{mockTeam.membersCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Лет существования:</span>
                <span className="font-semibold">{new Date().getFullYear() - mockTeam.foundedYear}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;
