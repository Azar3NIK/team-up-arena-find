// src/components/TeamFilters.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { SlidersHorizontal } from "lucide-react";

// интерфейс для пропсов, который соответствует FindTeams.tsx
interface FiltersState {
  name: string;
  sportType: string;
  skillLevel: string;
}

interface TeamFiltersProps {
  filters: FiltersState;
  onFiltersChange: (newFilters: FiltersState) => void;
}

export const TeamFilters = ({ filters, onFiltersChange }: TeamFiltersProps) => {
  // обработчик для всех полей ввода
  const handleInputChange = (field: keyof FiltersState, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleReset = () => {
    onFiltersChange({
      name: '',
      sportType: '',
      skillLevel: 'all'
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Фильтры
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Поиск по названию */}
        <div className="space-y-2">
          <Label htmlFor="name">Название команды</Label>
          <Input
            id="name"
            placeholder="Например: Спартак"
            value={filters.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        {/* Фильтр по виду спорта */}
        <div className="space-y-2">
          <Label htmlFor="sportType">Вид спорта</Label>
          <Input
            id="sportType"
            placeholder="Например: Футбол"
            value={filters.sportType}
            onChange={(e) => handleInputChange('sportType', e.target.value)}
          />
        </div>

        {/* Фильтр по уровню */}
        <div className="space-y-2">
          <Label htmlFor="skillLevel">Уровень</Label>
          <Select
            value={filters.skillLevel}
            onValueChange={(value) => handleInputChange('skillLevel', value)}
          >
            <SelectTrigger id="skillLevel">
              <SelectValue placeholder="Любой уровень" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любой уровень</SelectItem>
              <SelectItem value="Новичок">Новичок</SelectItem>
              <SelectItem value="Любитель">Любитель</SelectItem>
              <SelectItem value="Полупрофессионал">Полупрофессионал</SelectItem>
              <SelectItem value="Профессионал">Профессионал</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Кнопка сброса */}
        <div className="pt-2">
            <Button variant="ghost" className="w-full" onClick={handleReset}>
                Сбросить фильтры
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};