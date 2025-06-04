
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateTeamForm {
  name: string;
  sport: string;
  location: string;
  level: string;
  description: string;
  stadium: string;
  trainings: string;
}

const CreateTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTeamForm>({
    defaultValues: {
      name: "",
      sport: "",
      location: "",
      level: "",
      description: "",
      stadium: "",
      trainings: "",
    },
  });

  const onSubmit = async (data: CreateTeamForm) => {
    setIsLoading(true);
    
    // Имитация создания команды
    setTimeout(() => {
      console.log("Создание команды:", data);
      
      toast({
        title: "Команда создана!",
        description: `Команда "${data.name}" успешно создана. Вы назначены капитаном.`,
      });
      
      setIsLoading(false);
      navigate("/my-team");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
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
        
        <div className="flex items-center space-x-3 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Создание команды</h1>
        </div>
        <p className="text-gray-600">
          Заполните информацию о вашей новой команде
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о команде</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Название команды */}
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Название команды обязательно" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название команды *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Введите название команды" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Вид спорта */}
              <FormField
                control={form.control}
                name="sport"
                rules={{ required: "Вид спорта обязателен" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вид спорта *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Например: Футбол, Баскетбол, Волейбол" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Местоположение */}
              <FormField
                control={form.control}
                name="location"
                rules={{ required: "Местоположение обязательно" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Местоположение *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Введите город" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Уровень подготовки */}
              <FormField
                control={form.control}
                name="level"
                rules={{ required: "Уровень подготовки обязателен" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Уровень подготовки *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите уровень" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Новичок">Новичок</SelectItem>
                        <SelectItem value="Любитель">Любитель</SelectItem>
                        <SelectItem value="Полупрофессионал">Полупрофессионал</SelectItem>
                        <SelectItem value="Профессионал">Профессионал</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Место для тренировок */}
              <FormField
                control={form.control}
                name="stadium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Место для тренировок</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Например: Стадион Лужники, зал №3" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Расписание тренировок */}
              <FormField
                control={form.control}
                name="trainings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Расписание тренировок</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Например: Вторник, Четверг - 19:00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Описание команды */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание команды</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Расскажите о вашей команде, целях, атмосфере..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Кнопки */}
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Создание..." : "Создать команду"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={isLoading}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTeam;
