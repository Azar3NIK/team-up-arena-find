
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bell, Calendar, User, Search, UserPlus, Info } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                  <span className="absolute -top-1 -right-1 bg-sport-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>
              <Link to="/profile">
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
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/profile">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <User className="h-5 w-5 text-sport-blue mr-2" />
                  Личный кабинет
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Редактируйте профиль и настройки
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
                  <span className="ml-2 bg-sport-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Новые приглашения и сообщения
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/training">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 text-sport-green mr-2" />
                  Тренировки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Расписание и участие в тренировках
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/my-team">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 text-sport-navy mr-2" />
                  Моя команда
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Управление командой и составом
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/find-team">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Search className="h-6 w-6 text-sport-blue mr-3" />
                  Найти команду
                </CardTitle>
                <CardDescription>
                  Ищите команды по виду спорта, уровню и местоположению
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
                  Найдите игроков для своей команды по навыкам и позициям
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
