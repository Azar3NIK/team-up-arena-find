
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface PlayerFiltersProps {
  filters: {
    search: string;
    sport: string;
    position: string;
    location: string;
    experience: string;
    teamStatus: string[];
    minRating: number;
  };
  onFiltersChange: (filters: any) => void;
}

export const PlayerFilters = ({ filters, onFiltersChange }: PlayerFiltersProps) => {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateTeamStatus = (status: string, checked: boolean) => {
    const newStatuses = checked 
      ? [...filters.teamStatus, status]
      : filters.teamStatus.filter(s => s !== status);
    updateFilter('teamStatus', newStatuses);
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      sport: '',
      position: '',
      location: '',
      experience: '',
      teamStatus: [],
      minRating: 0
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры поиска</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Поиск по имени</Label>
          <Input
            id="search"
            placeholder="Введите имя игрока"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        <div>
          <Label>Вид спорта</Label>
          <Select value={filters.sport} onValueChange={(value) => updateFilter('sport', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите спорт" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все виды спорта</SelectItem>
              <SelectItem value="football">Футбол</SelectItem>
              <SelectItem value="basketball">Баскетбол</SelectItem>
              <SelectItem value="volleyball">Волейбол</SelectItem>
              <SelectItem value="tennis">Теннис</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Позиция</Label>
          <Select value={filters.position} onValueChange={(value) => updateFilter('position', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите позицию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Любая позиция</SelectItem>
              <SelectItem value="goalkeeper">Вратарь</SelectItem>
              <SelectItem value="defender">Защитник</SelectItem>
              <SelectItem value="midfielder">Полузащитник</SelectItem>
              <SelectItem value="forward">Нападающий</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Город</Label>
          <Input
            placeholder="Введите город"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        <div>
          <Label>Опыт</Label>
          <Select value={filters.experience} onValueChange={(value) => updateFilter('experience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите опыт" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Любой опыт</SelectItem>
              <SelectItem value="beginner">Новичок</SelectItem>
              <SelectItem value="amateur">Любитель</SelectItem>
              <SelectItem value="semi-pro">Полупрофессионал</SelectItem>
              <SelectItem value="professional">Профессионал</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Статус поиска команды</Label>
          <div className="space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="looking"
                checked={filters.teamStatus.includes('looking')}
                onCheckedChange={(checked) => updateTeamStatus('looking', checked as boolean)}
              />
              <Label htmlFor="looking">Ищет команду</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has-team"
                checked={filters.teamStatus.includes('has-team')}
                onCheckedChange={(checked) => updateTeamStatus('has-team', checked as boolean)}
              />
              <Label htmlFor="has-team">В команде</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="not-looking"
                checked={filters.teamStatus.includes('not-looking')}
                onCheckedChange={(checked) => updateTeamStatus('not-looking', checked as boolean)}
              />
              <Label htmlFor="not-looking">Не ищет команду</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="rating">Минимальный рейтинг</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="0.0"
            value={filters.minRating || ''}
            onChange={(e) => updateFilter('minRating', parseFloat(e.target.value) || 0)}
          />
        </div>

        <Button variant="outline" onClick={resetFilters} className="w-full">
          Сбросить фильтры
        </Button>
      </CardContent>
    </Card>
  );
};
