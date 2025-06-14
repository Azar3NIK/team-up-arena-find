import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Save,
  User,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  playerProfileService,
  PlayerProfileBackendData,
  UpdatePlayerProfileRequestData,
  axiosInstance,
} from "@/services/playerProfileService";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { fileService } from "@/services/fileService";

interface PlayerProfileFrontendState {
  id: string; // ID профиля, обязателен для существующего профиля
  name: string; // fullName на бэкенде
  avatar: string; // photoUrl на бэкенде
  location: string;
  sport: string; // game на бэкенде
  experience: string; // skillLevel на бэкенде (строковое представление)
  playExperienceYears: number;
  teamStatus: "looking" | "has-team" | "not-looking"; // teamFindingStatus на бэкенде (строковое представление)
  age: number;
  gender: string;
  height: number;
  weight: number;
  description: string; // aboutMe на бэкенде
  phone: string;
  email: string;
  telegram: string;
}

const PersonalCabinet = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Например, если пользователь залогинен, у него есть свой ID профиля.
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  const [profile, setProfile] = useState<PlayerProfileFrontendState>({
    id: "", // Будет загружен с бэкенда
    name: "",
    avatar: "/placeholder.svg",
    location: "",
    sport: "",
    experience: "Любитель", // Дефолтное значение
    playExperienceYears: 0,
    teamStatus: "not-looking", // Дефолтное значение
    age: 0,
    gender: "Мужской", // Дефолтное значение
    height: 0,
    weight: 0,
    description: "",
    phone: "",
    email: "",
    telegram: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PlayerProfileFrontendState>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await fileService.uploadFile(file);
      // Обновляем formData с новым URL аватара
      handleInputChange("avatar", uploadedUrl);
      toast({ title: "Аватар успешно загружен!" });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить аватар.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // --- Вспомогательные функции для маппинга данных между фронтендом и бэкендом ---
  const mapSkillLevelToExperience = (skillLevel?: number): string => {
    switch (skillLevel) {
      case 0:
        return "Новичок";
      case 1:
        return "Любитель";
      case 2:
        return "Полупрофессионал";
      case 3:
        return "Профессионал";
      default:
        return "Любитель"; // Дефолтное значение
    }
  };

  const mapExperienceToSkillLevel = (experience: string): number => {
    switch (experience) {
      case "Новичок":
        return 0;
      case "Любитель":
        return 1;
      case "Полупрофессионал":
        return 2;
      case "Профессионал":
        return 3;
      default:
        return 1; // Дефолтное значение
    }
  };

  const mapTeamFindingStatusToFrontend = (
    status?: number
  ): "looking" | "has-team" | "not-looking" => {
    switch (status) {
      case 0:
        return "looking";
      case 1:
        return "has-team";
      case 2:
        return "not-looking";
      default:
        return "not-looking"; // Дефолтное значение
    }
  };

  const mapTeamStatusToBackend = (
    status: "looking" | "has-team" | "not-looking"
  ): number => {
    switch (status) {
      case "looking":
        return 0;
      case "has-team":
        return 1;
      case "not-looking":
        return 2;
      default:
        return 2; // Дефолтное значение
    }
  };

  const getTeamStatusText = (status: string) => {
    switch (status) {
      case "looking":
        return "Ищет команду";
      case "has-team":
        return "В команде";
      case "not-looking":
        return "Не ищет команду";
      default:
        return status;
    }
  };
  // --- Конец вспомогательных функций ---

  // useEffect для загрузки данных профиля при монтировании компонента
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        // Используем axiosInstance, экспортированный из playerProfileService
        const response = await axiosInstance.get<string>(
          "https://localhost:7260/playerprofiles/myprofileid"
        );
        const fetchedProfileId = response.data;

        if (!fetchedProfileId) {
          throw new Error(
            "Не удалось получить ID профиля текущего пользователя."
          );
        }
        setCurrentProfileId(fetchedProfileId);

        const data: PlayerProfileBackendData =
          await playerProfileService.getProfileById(fetchedProfileId);

        // Маппинг данных с бэкенда на фронтенд формат
        const mappedProfile: PlayerProfileFrontendState = {
          id: data.id,
          name: data.fullName || "",
          avatar: data.photoUrl || "/placeholder.svg",
          location: data.location || "",
          sport: data.game || "",
          experience: mapSkillLevelToExperience(data.skillLevel),
          playExperienceYears: data.playExperienceYears || 0,
          teamStatus: mapTeamFindingStatusToFrontend(data.teamFindingStatus),
          age: data.age || 0,
          gender: data.gender || "",
          height: data.height || 0,
          weight: data.weight || 0,
          description: data.aboutMe || "",
          phone: data.phone || "",
          email: data.email || "",
          telegram: data.telegram || "",
        };

        setProfile(mappedProfile);
        setFormData(mappedProfile); // Инициализируем форму данными из профиля
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
        setFetchError(
          "Не удалось загрузить данные профиля. Возможно, вы не авторизованы или произошла ошибка сервера."
        );
        toast({
          title: "Ошибка загрузки",
          description:
            "Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const handleInputChange = (
    field: keyof PlayerProfileFrontendState,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields: Array<keyof PlayerProfileFrontendState> = [
      "name",
      "location",
      "sport",
      "age",
      "gender",
      "phone",
      "email",
    ];

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" &&
          (formData[field] as string).trim() === "")
      ) {
        newErrors[field as string] = "Это поле обязательно для заполнения";
      }
    });

    // Дополнительные проверки
    if (formData.age && (formData.age < 10 || formData.age > 100)) {
      newErrors.age = "Введите корректный возраст (10-100)";
    }

    if (formData.phone && !/^\+?[\d\s()-]+$/.test(formData.phone)) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля корректно",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Маппинг данных фронтенда на формат бэкенда для отправки
      const dataToSave: UpdatePlayerProfileRequestData = {
        id: formData.id, // ID обязателен для UpdatePlayerProfileRequest
        fullName: formData.name,
        location: formData.location,
        game: formData.sport,
        skillLevel: mapExperienceToSkillLevel(formData.experience),
        playExperienceYears: formData.playExperienceYears,
        teamFindingStatus: mapTeamStatusToBackend(formData.teamStatus),
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        aboutMe: formData.description,
        phone: formData.phone,
        email: formData.email,
        telegram: formData.telegram,
        photoUrl:
          formData.avatar === "/placeholder.svg" ? null : formData.avatar, // Если аватарка по умолчанию, отправляем null
      };

      await playerProfileService.updateProfile(formData.id, dataToSave);
      setProfile(formData); // Обновляем основное состояние профиля после успешного сохранения
      setIsEditing(false);
      setErrors({});
      toast({
        title: "Профиль обновлен",
        description: "Ваши изменения успешно сохранены",
      });
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
      toast({
        title: "Ошибка сохранения",
        description:
          "Не удалось сохранить изменения профиля. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile); // Откатываем изменения в formData к текущему сохраненному профилю
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из своего аккаунта.",
      });
      // Перенаправляем на главную страницу или страницу входа
      navigate("/");
    } catch (error) {
      // Эта ошибка будет вызвана, только если мы решим пробрасывать ее из сервиса
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить выход. Попробуйте снова.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-xl text-gray-700">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Назад к панели
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Личный кабинет
        </h1>
        <p className="text-gray-600">Управляйте своей анкетой игрока</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Превью профиля */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Превью анкеты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="relative w-24 h-24 mx-auto group">
                  {" "}
                  {/* Добавили w-24, h-24 и group */}
                  <Avatar className="h-full w-full">
                    {" "}
                    {/* Используем h-full, w-full */}
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="text-lg">
                      {formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {/* Оверлей для загрузки теперь ВНУТРИ родительского div */}
                  {isEditing && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        !isUploading && fileInputRef.current?.click()
                      } // Блокируем клик во время загрузки
                    >
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </div>
                  )}
                </div>

                {/* Скрытый input для выбора файла */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleAvatarChange}
                />

                <div>
                  <h3 className="text-xl font-semibold">{formData.name}</h3>
                  <p className="text-gray-600">{formData.location}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline">{formData.sport}</Badge>
                    <Badge variant="outline">{formData.experience}</Badge>
                  </div>
                  <Badge
                    className={
                      formData.teamStatus === "looking"
                        ? "bg-green-500"
                        : formData.teamStatus === "has-team"
                        ? "bg-gray-500"
                        : "bg-orange-500"
                    }
                  >
                    {getTeamStatusText(formData.teamStatus)}
                  </Badge>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>Возраст: {formData.age} лет</p>
                  <p>Пол: {formData.gender}</p>
                  <p>Игровой стаж: {formData.playExperienceYears} лет</p>
                  <p>Рост: {formData.height} см</p>
                  <p>Вес: {formData.weight} кг</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* карточка "Действия" с кнопкой выхода */}
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти из аккаунта
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Форма редактирования */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Редактирование профиля
              </CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Редактировать
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Имя и фамилия*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                  {errors.name && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Местоположение*</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    disabled={!isEditing || isLoading}
                  />
                  {errors.location && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.location}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Вид спорта*</Label>
                  <Input
                    value={formData.sport}
                    onChange={(e) => handleInputChange("sport", e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                  {errors.sport && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.sport}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Уровень игры</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) =>
                      handleInputChange("experience", value)
                    }
                    disabled={!isEditing || isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Новичок">Новичок</SelectItem>
                      <SelectItem value="Любитель">Любитель</SelectItem>
                      <SelectItem value="Полупрофессионал">
                        Полупрофессионал
                      </SelectItem>
                      <SelectItem value="Профессионал">Профессионал</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Возраст*</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      handleInputChange("age", parseInt(e.target.value))
                    }
                    disabled={!isEditing || isLoading}
                    min="10"
                    max="100"
                  />
                  {errors.age && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.age}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Пол*</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                    disabled={!isEditing || isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Мужской">Мужской</SelectItem>
                      <SelectItem value="Женский">Женский</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.gender}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Игровой стаж (лет)</Label>
                  <Input
                    type="number"
                    value={formData.playExperienceYears}
                    onChange={(e) =>
                      handleInputChange(
                        "playExperienceYears",
                        parseInt(e.target.value)
                      )
                    }
                    disabled={!isEditing || isLoading}
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <Label>Статус поиска команды</Label>
                  <Select
                    value={formData.teamStatus}
                    onValueChange={(value) =>
                      handleInputChange("teamStatus", value)
                    }
                    disabled={!isEditing || isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="looking">Ищет команду</SelectItem>
                      <SelectItem value="has-team">В команде</SelectItem>
                      <SelectItem value="not-looking">
                        Не ищет команду
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Рост (см)</Label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", parseInt(e.target.value))
                    }
                    disabled={!isEditing || isLoading}
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <Label>Вес (кг)</Label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", parseInt(e.target.value))
                    }
                    disabled={!isEditing || isLoading}
                    min="30"
                    max="200"
                  />
                </div>
              </div>

              {/* Описание */}
              <div>
                <Label htmlFor="description">О себе</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={!isEditing || isLoading}
                  rows={4}
                  placeholder="Расскажите о себе, своем опыте и целях..."
                />
              </div>

              {/* Контактная информация */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Контактная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Телефон*</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing || isLoading}
                    />
                    {errors.phone && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing || isLoading}
                    />
                    {errors.email && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input
                      id="telegram"
                      value={formData.telegram}
                      onChange={(e) =>
                        handleInputChange("telegram", e.target.value)
                      }
                      disabled={!isEditing || isLoading}
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalCabinet;
