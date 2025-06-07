// src/pages/Notifications.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Check, X, Users, Loader2, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { invitationService, TeamInvitation } from "@/services/invitationService"; // Импортируем сервис

const Notifications = () => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      setIsLoading(true);
      try {
        const data = await invitationService.getPendingInvitations();
        setInvitations(data);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить уведомления.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvitations();
  }, [toast]);

  const handleResponse = async (invitationId: string, accept: boolean) => {
    try {
      await invitationService.respondToInvitation(invitationId, { accept });
      
      // Оптимистичное обновление: удаляем приглашение из списка
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));

      toast({
        title: "Ответ отправлен",
        description: `Вы успешно ${accept ? 'приняли' : 'отклонили'} приглашение.`,
      });

    } catch (error: any) {
        const errorMessage = error.response?.data || "Произошла ошибка при ответе на приглашение.";
        toast({
            title: "Ошибка",
            description: errorMessage,
            variant: "destructive",
        });
    }
  };

  const NotificationCard = ({ invitation }: { invitation: TeamInvitation }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <Users /> Приглашение в команду
        </CardTitle>
        <CardDescription>
            {new Date(invitation.invitationDate).toLocaleDateString('ru-RU')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{invitation.teamName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-gray-700 mb-4">
              Капитан <strong>{invitation.senderUserName}</strong> приглашает вас присоединиться к команде <strong>"{invitation.teamName}"</strong>.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => handleResponse(invitation.id, true)} className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="h-4 w-4 mr-1" /> Принять
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleResponse(invitation.id, false)}>
                <X className="h-4 w-4 mr-1" /> Отклонить
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Назад к дашборду
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-sport-navy">Уведомления</h1>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : invitations.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">Нет новых уведомлений</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Приглашения в команды и другие уведомления будут отображаться здесь.
                </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => (
              <NotificationCard key={inv.id} invitation={inv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;