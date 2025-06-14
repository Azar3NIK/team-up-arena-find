// src/pages/Trainings.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, MapPin, Plus, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInTimeZone } from 'date-fns-tz';
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
import { useToast } from "@/hooks/use-toast";
import { trainingService, TrainingData } from "@/services/trainingService";

const Trainings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trainings, setTrainings] = useState<TrainingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      setIsLoading(true);
      try {
        const data = await trainingService.getMyTeamTrainings();
        setTrainings(data);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить расписание тренировок.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainings();
  }, [toast]);

  const handleCompleteTraining = async (trainingId: string) => {
    try {
      await trainingService.completeTraining(trainingId);
      // Находим тренировку и меняем ее статус на клиенте без повторного запроса
      setTrainings(prev =>
        prev.map(t =>
          t.id === trainingId ? { ...t, isCompleted: true } : t
        )
      );
      toast({
        title: "Успех",
        description: "Тренировка была отмечена как завершенная.",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data || "Не удалось завершить тренировку.",
        variant: "destructive",
      });
    }
  };

  // Фильтруем тренировки на активные и завершенные
  const activeTrainings = trainings.filter(t => !t.isCompleted);
  const completedTrainings = trainings.filter(t => t.isCompleted);

  // Вспомогательная функция для форматирования продолжительности
  const getDurationText = (minutes: number) => {
    if (minutes < 60) return `${minutes} мин`;
    if (minutes % 60 === 0) {
      const hours = minutes / 60;
      return `${hours} час${hours > 1 ? (hours > 4 ? 'ов' : 'а') : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours} ч ${remainingMins} мин`;
  };

  // Вспомогательная функция для форматирования даты и времени
  const formatTrainingDate = (dateStr: string) => {
    try {
      // Используем тот же подход, что и в уведомлениях:
      // форматируем UTC-дату, но выводим ее как будто она в часовом поясе UTC,
      // чтобы избежать конвертации в локальное время.
      return formatInTimeZone(dateStr, 'UTC', 'd MMMM yyyy, HH:mm', { locale: ru });
    } catch (e) {
      console.error("Ошибка форматирования даты тренировки:", e);
      // Возвращаем что-то осмысленное в случае ошибки
      return "Неверный формат даты";
    }
  };

  // Переиспользуемый компонент для карточки тренировки
  const TrainingCard = ({ training }: { training: TrainingData }) => (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="text-lg mb-2">{training.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatTrainingDate(training.dateTime)}</span>
            </div>
          </div>
          <Badge variant={!training.isCompleted ? 'default' : 'secondary'} className="flex-shrink-0">
            {!training.isCompleted ? 'Активная' : 'Завершена'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{training.location}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {getDurationText(training.durationInMinutes)}
            </span>
          </div>
          {training.description && (
            <p className="text-sm text-gray-600 pt-2 border-t">{training.description}</p>
          )}
        </div>
        {!training.isCompleted && (
          <div className="pt-3 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Завершить тренировку
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Завершить тренировку?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены, что хотите отметить тренировку "{training.name}" как завершенную?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCompleteTraining(training.id)}>
                    Завершить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Рендер состояния загрузки
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Основной рендер компонента
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex justify-between items-start mb-6 gap-4">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            К дашборду
          </Button>
          <h1 className="text-3xl font-bold">Тренировки</h1>
          <p className="text-gray-600 mt-2">
            Управляйте тренировками вашей команды
          </p>
        </div>
        <div className="flex-shrink-0 mt-[60px]"> {/* Добавляем отступ, чтобы кнопка была на одном уровне с описанием */}
            <Button onClick={() => navigate('/create-training')}>
                <Plus className="h-4 w-4 mr-2" />
                Создать тренировку
            </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Активные ({activeTrainings.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Завершенные ({completedTrainings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeTrainings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeTrainings.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Нет активных тренировок
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Создайте первую тренировку для вашей команды.
                </p>
                <Button onClick={() => navigate('/create-training')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать тренировку
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedTrainings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedTrainings.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Нет завершенных тренировок
                </h3>
                <p className="text-gray-600 text-center">
                  История завершенных тренировок будет отображаться здесь.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trainings;