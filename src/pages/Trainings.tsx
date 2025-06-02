
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, MapPin, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Типы данных
interface Training {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  description?: string;
  status: 'active' | 'completed';
  participants: number;
}

const Trainings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Моковые данные тренировок
  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: "1",
      name: "Вечерняя тренировка по футболу",
      date: "2024-06-05",
      time: "19:00",
      duration: "120",
      location: "Стадион Лужники, поле №3",
      description: "Работа над техникой и тактикой",
      status: 'active',
      participants: 15
    },
    {
      id: "2",
      name: "Утренняя пробежка",
      date: "2024-06-07",
      time: "08:00",
      duration: "60",
      location: "Парк Сокольники",
      status: 'active',
      participants: 8
    },
    {
      id: "3",
      name: "Тренировка по баскетболу",
      date: "2024-05-30",
      time: "18:00",
      duration: "90",
      location: "Спортзал школы №15",
      description: "Отработка бросков",
      status: 'completed',
      participants: 12
    },
    {
      id: "4",
      name: "Силовая подготовка",
      date: "2024-05-28",
      time: "17:00",
      duration: "90",
      location: "Фитнес-центр 'Атлант'",
      status: 'completed',
      participants: 10
    }
  ]);

  const activeTrainings = trainings.filter(training => training.status === 'active');
  const completedTrainings = trainings.filter(training => training.status === 'completed');

  const handleCompleteTraining = (trainingId: string) => {
    setTrainings(prev => 
      prev.map(training => 
        training.id === trainingId 
          ? { ...training, status: 'completed' as const }
          : training
      )
    );
    
    toast({
      title: "Тренировка завершена",
      description: "Тренировка была успешно завершена",
    });
  };

  const getDurationText = (minutes: string) => {
    const mins = parseInt(minutes);
    if (mins < 60) {
      return `${mins} мин`;
    } else if (mins === 60) {
      return "1 час";
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      if (remainingMins === 0) {
        return `${hours} час${hours > 1 ? 'а' : ''}`;
      } else {
        return `${hours} ч ${remainingMins} мин`;
      }
    }
  };

  const formatTrainingDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "d MMMM yyyy", { locale: ru });
  };

  const TrainingCard = ({ training }: { training: Training }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{training.name}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatTrainingDate(training.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{training.time}</span>
              </div>
            </div>
          </div>
          <Badge variant={training.status === 'active' ? 'default' : 'secondary'}>
            {training.status === 'active' ? 'Активная' : 'Завершена'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{training.location}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Продолжительность: {getDurationText(training.duration)}
            </span>
            <span className="text-gray-600">
              Участников: {training.participants}
            </span>
          </div>

          {training.description && (
            <p className="text-sm text-gray-600 mt-2">{training.description}</p>
          )}

          {training.status === 'active' && (
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
                      Вы уверены, что хотите завершить тренировку "{training.name}"? 
                      Это действие нельзя будет отменить.
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
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Тренировки</h1>
          <p className="text-gray-600 mt-2">
            Управляйте тренировками вашей команды
          </p>
        </div>
        <Button onClick={() => navigate('/create-training')}>
          <Plus className="h-4 w-4 mr-2" />
          Создать тренировку
        </Button>
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
                  Создайте первую тренировку для вашей команды
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
                  Завершенные тренировки будут отображаться здесь
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
