// Dashboard.tsx ---

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bell, Calendar, User, Search, UserPlus, Info, Loader2 } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { useToast } from "@/hooks/use-toast"; 
import { teamService } from "@/services/teamService"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isTeamLoading, setIsTeamLoading] = useState(false);

  const handleMyTeamClick = async () => {
    setIsTeamLoading(true);
    try {
      // Вызываем метод сервиса для проверки наличия команды
      const team = await teamService.getMyTeam();

      if (team) {
        // Если команда есть, переходим на страницу команды
        navigate("/my-team");
      } else {
        // Если команды нет (сервис вернул null), переходим на страницу создания
        navigate("/create-team");
      }
    } catch (error) {
      // Обрабатываем непредвиденные ошибки
      toast({
        title: "Ошибка",
        description: "Не удалось проверить информацию о команде. Попробуйте снова.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsTeamLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... остальная часть хедера ... */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-sport rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-sport-navy">FindPlayer</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/notifications">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {/*<span className="absolute -top-1 -right-1 bg-sport-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>*/}
                </Button>
              </Link>
              <Link to="/personal-cabinet">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5 mr-2" />
                  Профиль
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* ... остальная часть ... */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sport-navy mb-2">
            Добро пожаловать, Игрок!
          </h1>
          <p className="text-gray-600">
            Управляйте своим профилем и найдите идеальную команду или игроков
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ... Другие карточки ... */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/personal-cabinet">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <User className="h-5 w-5 text-sport-blue mr-2" />
                  Личный кабинет
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Редактируйте профиль
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/notifications">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Bell className="h-5 w-5 text-sport-orange mr-2" />
                  Уведомления
                  {/*<span className="ml-2 bg-sport-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>*/}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Новые приглашения и заявки
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/trainings">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 text-sport-green mr-2" />
                  Тренировки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Тренировки вашей команды
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
          
          {/* КАРТОЧКА "МОЯ КОМАНДА" */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={!isTeamLoading ? handleMyTeamClick : undefined}
          >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  {isTeamLoading ? (
                    <Loader2 className="h-5 w-5 text-sport-navy mr-2 animate-spin" />
                  ) : (
                    <Users className="h-5 w-5 text-sport-navy mr-2" />
                  )}
                  Моя команда
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Информация о команде
                </CardDescription>
              </CardContent>
          </Card>
        </div>

        {/* ... остальная часть компонента ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/find-teams">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Search className="h-6 w-6 text-sport-blue mr-3" />
                  Найти команду
                </CardTitle>
                <CardDescription>
                  Ищите команды по при помощи фильтров
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full gradient-orange text-white hover:opacity-90">
                  Начать поиск
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/find-players">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <UserPlus className="h-6 w-6 text-sport-green mr-3" />
                  Найти игроков
                </CardTitle>
                <CardDescription>
                  Найдите игроков для своей команды при помощи фильтров
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full gradient-orange text-white hover:opacity-90">
                  Поиск игроков
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;