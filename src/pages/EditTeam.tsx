// src/pages/EditTeam.tsx

import { useState, useEffect, useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Trash2, Loader2, Save, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { teamService, UpdateTeamData } from "@/services/teamService";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Импортируем компоненты аватара
import { fileService } from "@/services/fileService"; // Импортируем сервис для загрузки файлов

// Схема валидации (такая же, как для создания команды)
const editTeamSchema = z.object({
  name: z.string().min(3, "Название должно содержать минимум 3 символа."),
  sportType: z.string().min(2, "Укажите вид спорта."),
  creationYear: z.coerce
    .number()
    .min(1900, "Год не может быть ранее 1900")
    .max(new Date().getFullYear(), "Год не может быть в будущем."),
  teamSkillLevel: z.string().nonempty("Выберите уровень подготовки."),
  aboutTeam: z
    .string()
    .max(500, "Описание не должно превышать 500 символов.")
    .optional(),
  logoUrl: z.string().optional(),
});
type EditTeamFormData = z.infer<typeof editTeamSchema>;

const mapNumberToLevel = (level: number | null): string => {
  if (level === null) return "";
  const levels = ["Новичок", "Любитель", "Полупрофессионал", "Профессионал"];
  return levels[level] || "";
};
const mapLevelToNumber = (level: string): number => {
  const levels = ["Новичок", "Любитель", "Полупрофессионал", "Профессионал"];
  const index = levels.indexOf(level);
  return index === -1 ? 1 : index; // Возвращаем 1 (Любитель) если не найдено
};

const EditTeam = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditTeamFormData>({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      // Добавляем logoUrl в дефолтные значения
      logoUrl: "/placeholder.svg",
    },
  });

  useEffect(() => {
    if (!id) {
      toast({
        title: "Ошибка",
        description: "ID команды не найден в URL.",
        variant: "destructive",
      });
      navigate("/my-team");
      return;
    }

    const fetchTeamData = async () => {
      setIsLoading(true);
      try {
        const data = await teamService.getTeamById(id);
        form.reset({
          name: data.name,
          sportType: data.sportType || "",
          creationYear: data.creationYear,
          teamSkillLevel: mapNumberToLevel(data.teamSkillLevel),
          aboutTeam: data.aboutTeam || "",
          logoUrl: data.logoUrl || "/placeholder.svg",
        });
        setMemberCount(data.membersCount);
      } catch (error) {
        toast({
          title: "Ошибка",
          description:
            "Не удалось загрузить данные команды для редактирования.",
          variant: "destructive",
        });
        navigate("/my-team");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [id, form, toast, navigate]);

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await fileService.uploadFile(file);
      // Обновляем поле logoUrl в форме
      form.setValue("logoUrl", uploadedUrl);
      toast({ title: "Логотип успешно загружен!" });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить логотип.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onUpdate = async (data: EditTeamFormData) => {
    if (!id) return;
    setIsProcessing(true);
    try {
      const payload: UpdateTeamData = {
        name: data.name,
        sportType: data.sportType,
        teamSkillLevel: mapLevelToNumber(data.teamSkillLevel),
        creationYear: data.creationYear,
        aboutTeam: data.aboutTeam,
        logoUrl: data.logoUrl === "/placeholder.svg" ? null : data.logoUrl,
      };
      console.log(payload);
      await teamService.updateTeam(id, payload);
      toast({
        title: "Успех!",
        description: "Данные команды успешно обновлены.",
      });
      navigate("/my-team");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные команды.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onInvalidSubmit = (errors: any) => {
    console.error("Ошибки валидации формы:", errors);
    toast({
      title: "Ошибка в форме",
      description: "Пожалуйста, проверьте правильность заполнения всех полей.",
      variant: "destructive",
    });
  };

  const onDelete = async () => {
    if (!id) return;
    setIsProcessing(true);
    try {
      await teamService.deleteTeam(id);
      toast({
        title: "Команда удалена",
        description: "Ваша команда и все связанные с ней данные были удалены.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить команду.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/my-team")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Назад к команде
        </Button>
        <h1 className="text-3xl font-bold">Редактирование команды</h1>
        <p className="text-gray-600">
          Измените информацию и логотип вашей команды.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о команде</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onUpdate, onInvalidSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Логотип команды</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 group">
                          <Avatar className="h-full w-full">
                            <AvatarImage
                              src={field.value}
                              alt="Логотип команды"
                            />
                            <AvatarFallback>
                              {form
                                .getValues("name")
                                ?.substring(0, 2)
                                .toUpperCase() || "???"}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              !isUploading && fileInputRef.current?.click()
                            }
                          >
                            {isUploading ? (
                              <Loader2 className="h-6 w-6 text-white animate-spin" />
                            ) : (
                              <Camera className="h-6 w-6 text-white" />
                            )}
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/png, image/jpeg, image/gif"
                          onChange={handleLogoChange}
                        />
                        <p className="text-sm text-muted-foreground">
                          Нажмите на изображение, чтобы загрузить новый логотип.
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
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
              <FormField
                control={form.control}
                name="sportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вид спорта *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Например: Футбол, Баскетбол"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Год основания *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Год основания команды"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamSkillLevel"
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
                        <SelectItem value="Полупрофессионал">
                          Полупрофессионал
                        </SelectItem>
                        <SelectItem value="Профессионал">
                          Профессионал
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutTeam"
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

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить изменения
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-10 pt-6 border-t border-destructive/20">
        <h3 className="text-lg font-semibold text-destructive">Опасная зона</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Удаление команды — необратимое действие. Все данные, связанные с
          командой, будут потеряны.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isProcessing}>
              <Trash2 className="mr-2 h-4 w-4" /> Удалить команду
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Ваша команда и все ее участники
                будут удалены навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Да, удалить команду
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EditTeam;
