import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Save, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PersonalCabinet = () => {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: "Александр Петров",
    avatar: "/placeholder.svg",
    location: "Москва",
    sport: "Футбол",
    experience: "Любитель",
    teamStatus: "looking",
    age: 25,
    gender: "Мужской",
    position: "Нападающий",
    height: 180,
    weight: 75,
    description: "Опытный нападающий с отличным чувством мяча. Играю в футбол уже 15 лет.",
    phone: "+7 (999) 123-45-67",
    email: "alexander.petrov@email.com",
    telegram: "@alex_petrov"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['name', 'location', 'sport', 'position', 'age', 'gender', 'phone', 'email'];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'Это поле обязательно для заполнения';
      }
    });

    // Дополнительные проверки
    if (formData.age && (formData.age < 10 || formData.age > 100)) {
      newErrors.age = 'Введите корректный возраст (10-100)';
    }

    if (formData.phone && !/^\+?[\d\s()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля корректно",
        variant: "destructive",
      });
      return;
    }

    setProfile(formData);
    setIsEditing(false);
    setErrors({});
    toast({
      title: "Профиль обновлен",
      description: "Ваши изменения успешно сохранены",
    });
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setErrors({});
  };

  const getTeamStatusText = (status: string) => {
    switch (status) {
      case 'looking': return 'Ищет команду';
      case 'has-team': return 'В команде';
      case 'not-looking': return 'Не ищет команду';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Личный кабинет</h1>
        <p className="text-gray-600">Управляйте своей анкетой игрока</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Превью профиля */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Превью анкеты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="text-lg">
                      {formData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">{formData.name}</h3>
                  <p className="text-gray-600">{formData.location}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline">{formData.sport}</Badge>
                    <Badge variant="outline">{formData.experience}</Badge>
                  </div>
                  <Badge className={
                    formData.teamStatus === 'looking' ? 'bg-green-500' :
                    formData.teamStatus === 'has-team' ? 'bg-gray-500' : 'bg-orange-500'
                  }>
                    {getTeamStatusText(formData.teamStatus)}
                  </Badge>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>Возраст: {formData.age} лет</p>
                  <p>Пол: {formData.gender}</p>
                  <p>Позиция: {formData.position}</p>
                  <p>Рост: {formData.height} см</p>
                  <p>Вес: {formData.weight} кг</p>
                </div>
              </div>
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
                  <Button variant="outline" onClick={handleCancel}>
                    Отмена
                  </Button>
                  <Button onClick={handleSave}>
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
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
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
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
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
                    onChange={(e) => handleInputChange('sport', e.target.value)}
                    disabled={!isEditing}
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
                    onValueChange={(value) => handleInputChange('experience', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Новичок">Новичок</SelectItem>
                      <SelectItem value="Любитель">Любитель</SelectItem>
                      <SelectItem value="Полупрофессионал">Полупрофессионал</SelectItem>
                      <SelectItem value="Профессионал">Профессионал</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Возраст*</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    disabled={!isEditing}
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
                    onValueChange={(value) => handleInputChange('gender', value)}
                    disabled={!isEditing}
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
                  <Label>Позиция*</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    disabled={!isEditing}
                  />
                  {errors.position && (
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.position}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Статус поиска команды</Label>
                  <Select 
                    value={formData.teamStatus} 
                    onValueChange={(value) => handleInputChange('teamStatus', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="looking">Ищет команду</SelectItem>
                      <SelectItem value="has-team">В команде</SelectItem>
                      <SelectItem value="not-looking">Не ищет команду</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Рост (см)</Label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                    disabled={!isEditing}
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <Label>Вес (кг)</Label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                    disabled={!isEditing}
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Расскажите о себе, своем опыте и целях..."
                />
              </div>

              {/* Контактная информация */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Телефон*</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
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
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
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
                      onChange={(e) => handleInputChange('telegram', e.target.value)}
                      disabled={!isEditing}
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