
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Check, X, Users, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "team_application" | "team_invitation";
  playerName: string;
  playerAvatar?: string;
  teamName: string;
  teamLogo?: string;
  message: string;
  createdAt: string;
  status: "pending" | "accepted" | "declined";
}

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "team_application",
      playerName: "Алексей Петров",
      playerAvatar: "",
      teamName: "Спартак Москва",
      teamLogo: "",
      message: "Хочу присоединиться к вашей команде в качестве нападающего",
      createdAt: "2024-01-15T10:30:00Z",
      status: "pending"
    },
    {
      id: "2",
      type: "team_invitation",
      playerName: "Мария Сидорова",
      playerAvatar: "",
      teamName: "Динамо Женская",
      teamLogo: "",
      message: "Приглашаем вас присоединиться к нашей команде",
      createdAt: "2024-01-14T15:45:00Z",
      status: "pending"
    },
    {
      id: "3",
      type: "team_application",
      playerName: "Дмитрий Иванов",
      playerAvatar: "",
      teamName: "Зенит",
      teamLogo: "",
      message: "Опытный защитник, готов тренироваться 3 раза в неделю",
      createdAt: "2024-01-13T09:15:00Z",
      status: "accepted"
    }
  ]);

  const handleAccept = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: "accepted" } 
          : notif
      )
    );
    toast({
      title: "Принято",
      description: "Заявка/приглашение было принято",
    });
  };

  const handleDecline = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: "declined" } 
          : notif
      )
    );
    toast({
      title: "Отклонено",
      description: "Заявка/приглашение было отклонено",
    });
  };

  const getNotificationIcon = (type: string) => {
    return type === "team_application" ? <UserPlus className="h-5 w-5" /> : <Users className="h-5 w-5" />;
  };

  const getNotificationTitle = (type: string) => {
    return type === "team_application" ? "Заявка в команду" : "Приглашение в команду";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, text: "Ожидает" },
      accepted: { variant: "default" as const, text: "Принято" },
      declined: { variant: "destructive" as const, text: "Отклонено" }
    };
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const pendingNotifications = notifications.filter(n => n.status === "pending");
  const processedNotifications = notifications.filter(n => n.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад к дашборду
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-sport rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-sport-navy">Уведомления</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Pending Notifications */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sport-navy mb-4">
            Требуют действия ({pendingNotifications.length})
          </h2>
          
          {pendingNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Нет новых уведомлений</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingNotifications.map((notification) => (
                <Card key={notification.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div>
                          <CardTitle className="text-lg">
                            {getNotificationTitle(notification.type)}
                          </CardTitle>
                          <CardDescription>
                            {new Date(notification.createdAt).toLocaleDateString('ru-RU')}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(notification.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={notification.playerAvatar} alt={notification.playerName} />
                        <AvatarFallback>
                          {notification.playerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="mb-2">
                          <p className="font-semibold">{notification.playerName}</p>
                          <p className="text-sm text-gray-600">Команда: {notification.teamName}</p>
                        </div>
                        <p className="text-gray-700 mb-4">{notification.message}</p>
                        
                        {notification.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAccept(notification.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Принять
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDecline(notification.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Отклонить
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Processed Notifications */}
        {processedNotifications.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-sport-navy mb-4">
              История ({processedNotifications.length})
            </h2>
            
            <div className="space-y-4">
              {processedNotifications.map((notification) => (
                <Card key={notification.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div>
                          <CardTitle className="text-lg">
                            {getNotificationTitle(notification.type)}
                          </CardTitle>
                          <CardDescription>
                            {new Date(notification.createdAt).toLocaleDateString('ru-RU')}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(notification.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={notification.playerAvatar} alt={notification.playerName} />
                        <AvatarFallback>
                          {notification.playerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="mb-2">
                          <p className="font-semibold">{notification.playerName}</p>
                          <p className="text-sm text-gray-600">Команда: {notification.teamName}</p>
                        </div>
                        <p className="text-gray-700">{notification.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
