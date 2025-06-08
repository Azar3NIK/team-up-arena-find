// src/pages/CreateTeam.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Для валидации
import { z } from "zod"; // Библиотека для валидации
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { teamService, CreateTeamData } from "@/services/teamService";

// Создаем схему валидации, которая соответствует модели на бэкенде
const createTeamSchema = z.object({
  name: z.string().min(3, "Название должно содержать минимум 3 символа."),
  sportType: z.string().min(2, "Укажите вид спорта."),
  creationYear: z.coerce // z.coerce пытается преобразовать значение в число
    .number({ invalid_type_error: "Год должен быть числом" })
    .min(1900, "Год основания не может быть раньше 1900.")
    .max(new Date().getFullYear(), "Год основания не может быть в будущем."),
  teamSkillLevel: z.string().nonempty("Выберите уровень подготовки."),
  aboutTeam: z.string().max(500, "Описание не должно превышать 500 символов.").optional(),
});

// Создаем тип для данных формы из схемы
type CreateTeamFormData = z.infer<typeof createTeamSchema>;

// Вспомогательная функция для маппинга уровня команды из строки в число
const mapLevelToNumber = (level: string): number => {
  switch (level) {
    case "Новичок": return 0;
    case "Любитель": return 1;
    case "Полупрофессионал": return 2;
    case "Профессионал": return 3;
    default: return 1; // По умолчанию - Любитель
  }
};

const CreateTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Настраиваем форму с валидацией
  const form = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      sportType: "",
      creationYear: new Date().getFullYear(),
      teamSkillLevel: "",
      aboutTeam: "",
    },
  });

  // Реализуем отправку данных на бэкенд
  const onSubmit = async (data: CreateTeamFormData) => {
    setIsLoading(true);
    
    try {
      // Подготавливаем данные для отправки на API
      const payload: CreateTeamData = {
        name: data.name,
        sportType: data.sportType,
        creationYear: data.creationYear,
        teamSkillLevel: mapLevelToNumber(data.teamSkillLevel), // Преобразуем строковый уровень в числовой
        aboutTeam: data.aboutTeam || "",
        logoUrl: null, 
      };

      // Вызываем сервис для создания команды
      const newTeamId = await teamService.createTeam(payload);
      
      toast({
        title: "Команда создана!",
        description: `Команда "${data.name}" успешно создана. ID: ${newTeamId}`,
      });
      
      // После успешного создания переходим на страницу команды
      navigate("/my-team");

    } catch (error) {
      console.error("Ошибка при создании команды:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать команду. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Заголовок с кнопкой назад */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          На главную
        </Button>
        <div className="flex items-center space-x-3 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Создание команды</h1>
        </div>
        <p className="text-gray-600">Заполните информацию о вашей новой команде</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о команде</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {/* 5. Обновляем JSX формы, чтобы имена полей совпадали со схемой */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название команды *</FormLabel>
                    <FormControl><Input placeholder="Введите название команды" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="sportType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вид спорта *</FormLabel>
                    <FormControl><Input placeholder="Например: Футбол" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="creationYear" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Год основания *</FormLabel>
                    <FormControl><Input type="number" placeholder="Например: 2024" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>

              <FormField control={form.control} name="teamSkillLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Уровень подготовки *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Выберите уровень" /></SelectTrigger>
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
              )}/>

              <FormField control={form.control} name="aboutTeam" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание команды</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Расскажите о вашей команде, целях, атмосфере..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}/>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    "Создать команду"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
                  Очистить
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