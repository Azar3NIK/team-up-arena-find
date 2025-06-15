import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Check,
  X,
  Users,
  UserPlus,
  Loader2,
  Inbox,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  invitationService,
  TeamInvitation,
} from "@/services/invitationService";
import {
  applicationService,
  TeamApplicationData,
} from "@/services/applicationService";
import {
  notificationService,
  GenericNotificationData,
} from "@/services/notificationService";
import { ru } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

// Карточка для Приглашения (от команды игроку)
const InvitationCard = ({
  invitation,
  onRespond,
}: {
  invitation: TeamInvitation;
  onRespond: (id: string, accept: boolean) => void;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Users /> Приглашение в команду
      </CardTitle>
      <CardDescription>
        {new Date(invitation.invitationDate).toLocaleDateString("ru-RU")}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-start space-x-4">
        {/* Аватар команды можно сделать ссылкой на профиль команды */}
        <Link to={`/team/${invitation.teamId}`}>
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {invitation.teamName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <p className="text-gray-700 mb-4">
            Капитан{" "}
            {/* Имя капитана делаем ссылкой на его профиль, если ID профиля есть */}
            {invitation.senderPlayerProfileId ? (
              <Link
                to={`/player/${invitation.senderPlayerProfileId}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {invitation.senderUserName}
              </Link>
            ) : (
              <strong className="font-semibold">
                {invitation.senderUserName}
              </strong>
            )}{" "}
            приглашает вас присоединиться к команде{" "}
            {/* Название команды тоже делаем ссылкой */}
            <Link
              to={`/team/${invitation.teamId}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              "{invitation.teamName}"
            </Link>
            .
          </p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => onRespond(invitation.id, true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-1" /> Принять
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRespond(invitation.id, false)}
            >
              <X className="h-4 w-4 mr-1" /> Отклонить
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Карточка для Заявки (от игрока капитану)
const ApplicationCard = ({
  application,
  onRespond,
}: {
  application: TeamApplicationData;
  onRespond: (id: string, accept: boolean) => void;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <UserPlus /> Заявка на вступление
      </CardTitle>
      <CardDescription>
        {new Date(application.applicationDate).toLocaleDateString("ru-RU")}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-start space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {application.applicantUserName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-gray-700 mb-4">
            Игрок{" "}
            {application.playerProfileId ? (
              <Link
                to={`/player/${application.playerProfileId}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {application.applicantUserName}
              </Link>
            ) : (
              <strong className="font-semibold">
                {application.applicantUserName}
              </strong>
            )}{" "}
            хочет присоединиться к вашей команде.
          </p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => onRespond(application.id, true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-1" /> Принять
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRespond(application.id, false)}
            >
              <X className="h-4 w-4 mr-1" /> Отклонить
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ApplicationStatusCard = ({
  notification,
  onMarkAsRead,
}: {
  notification: GenericNotificationData;
  onMarkAsRead: (id: string) => void; // Определяем его тип
}) => {
  const isAccepted = notification.type === 3; // 3 соответствует ApplicationAccepted
  return (
    // Добавляем flex flex-col, чтобы футер прижался к низу
    <Card
      className={
        (isAccepted
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200") + " flex flex-col"
      }
    >
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {isAccepted ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          Ответ на вашу заявку
        </CardTitle>
        <CardDescription>
          Получено:{" "}
          {new Date(notification.createdAt).toLocaleString("ru-RU", {
            day: "numeric",
            month: "long",
          })}
        </CardDescription>
      </CardHeader>

      {/* Добавляем flex-grow, чтобы контент занимал все доступное место */}
      <CardContent className="flex-grow">
        <p className="text-gray-800">{notification.message}</p>
        {notification.relatedEntityId && (
          <div className="mt-3">
            <Link to={`/team/${notification.relatedEntityId}`}>
              <Button variant="outline" size="sm">
                Перейти к команде
              </Button>
            </Link>
          </div>
        )}
      </CardContent>

      <div className="p-4 pt-0 border-t flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
          // При клике вызываем функцию onMarkAsRead, передавая ID этого уведомления
          onClick={() => onMarkAsRead(notification.id)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Понятно
        </Button>
      </div>
    </Card>
  );
};

const TrainingNotificationCard = ({
  notification,
  onMarkAsRead,
}: {
  notification: GenericNotificationData;
  onMarkAsRead: (id: string) => void;
}) => {
  console.log(
    `Рендеринг карточки TrainingNotificationCard с ID: ${notification.id}`
  );
  let displayMessage = notification.message;
  let formattedTrainingDate: string | null = null;

  const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/;
  const match = notification.message.match(isoDateRegex);

  if (match && match[0]) {
    try {
      const extractedDateString = match[0];
      formattedTrainingDate = formatInTimeZone(
        extractedDateString,
        "UTC",
        "d MMMM yyyy, HH:mm",
        { locale: ru }
      );
      displayMessage = notification.message.replace(
        extractedDateString,
        formattedTrainingDate
      );
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card className="bg-blue-50 border-blue-200 flex flex-col">
      <CardHeader className="pb-4">
        {" "}
        {/* Уменьшаем нижний отступ */}
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" /> Уведомление о
          тренировке
        </CardTitle>
        <CardDescription>
          Получено:{" "}
          {new Date(notification.createdAt).toLocaleString("ru-RU", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-800">{displayMessage}</p>
      </CardContent>
      {/* НОВЫЙ БЛОК ДЛЯ КНОПКИ */}
      <div className="p-4 pt-0 border-t-0 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
          onClick={() => onMarkAsRead(notification.id)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Просмотрено
        </Button>
      </div>
    </Card>
  );
};

const Notifications = () => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [applications, setApplications] = useState<TeamApplicationData[]>([]);
  const [genericNotifications, setGenericNotifications] = useState<
    GenericNotificationData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const [invitationsData, applicationsData, genericData] =
          await Promise.all([
            invitationService.getPendingInvitations(),
            applicationService.getPendingForMyTeam(),
            notificationService.getMyGenericNotifications(),
          ]);

        console.log("ДАННЫЕ ИЗ API:", {
          invitationsData,
          applicationsData,
          genericData,
        });

        setInvitations(invitationsData);
        setApplications(applicationsData);
        setGenericNotifications(genericData);
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
    fetchNotifications();
  }, [toast]);

  const handleInvitationResponse = async (
    invitationId: string,
    accept: boolean
  ) => {
    try {
      await invitationService.respondToInvitation(invitationId, { accept });
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      toast({
        title: "Ответ отправлен",
        description: `Приглашение было ${accept ? "принято" : "отклонено"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data || "Произошла ошибка",
        variant: "destructive",
      });
    }
  };

  const handleApplicationResponse = async (
    applicationId: string,
    accept: boolean
  ) => {
    try {
      await applicationService.respondToApplication(applicationId, accept);
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      toast({
        title: "Ответ отправлен",
        description: `Заявка была ${accept ? "принята" : "отклонена"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data || "Произошла ошибка",
        variant: "destructive",
      });
    }
  };

  const handleDismissNotification = async (notificationId: string) => {
    try {
      // Вызываем новый метод сервиса
      console.log(`КЛИК! Вызван onMarkAsRead с ID: ${notificationId}`);
      await notificationService.dismissNotification(notificationId);

      // Оптимистичное обновление остается таким же
      setGenericNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить уведомление.",
        variant: "destructive",
      });
    }
  };

  const renderGenericNotification = (notification: GenericNotificationData) => {
    console.log("Рендеринг уведомления с типом:", notification.type); // <-- ЛОГ
    switch (notification.type) {
      case 2: // Число соответствует enum NotificationType.NewTraining
        return (
          <TrainingNotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleDismissNotification}
          />
        );
      case 3: // ApplicationAccepted
      case 4: // ApplicationDeclined
        return (
          <ApplicationStatusCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleDismissNotification}
          />
        );
      default:
        console.log("Неизвестный тип уведомления, не рендерится."); // <-- ЛОГ
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к дашборду
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
        ) : invitations.length === 0 &&
          applications.length === 0 &&
          genericNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Inbox className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">
                Нет новых уведомлений
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Приглашения и заявки будут отображаться здесь.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {applications.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Заявки в вашу команду ({applications.length})
                </h2>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onRespond={handleApplicationResponse}
                    />
                  ))}
                </div>
              </div>
            )}
            {invitations.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Приглашения для вас ({invitations.length})
                </h2>
                <div className="space-y-4">
                  {invitations.map((inv) => (
                    <InvitationCard
                      key={inv.id}
                      invitation={inv}
                      onRespond={handleInvitationResponse}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* БЛОК для информационных уведомлений */}
            {genericNotifications.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">События и новости</h2>
                <div className="space-y-4">
                  {genericNotifications.map(renderGenericNotification)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
