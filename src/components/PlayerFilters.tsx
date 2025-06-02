
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
    location: string;
    experience: string;
    teamStatus: string[];
    age: string;
    gender: string;
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
      location: '',
      experience: '',
      teamStatus: [],
      age: '',
      gender: ''
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
          <Input
            placeholder="Введите вид спорта"
            value={filters.sport}
            onChange={(e) => updateFilter('sport', e.target.value)}
          />
        </div>

        <div>
          <Label>Местоположение</Label>
          <Input
            placeholder="Введите город"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        <div>
          <Label>Уровень игры</Label>
          <Select value={filters.experience} onValueChange={(value) => updateFilter('experience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите опыт" />
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

        <div>
          <Label>Возраст</Label>
          <Input
            type="number"
            placeholder="Введите возраст"
            value={filters.age}
            onChange={(e) => updateFilter('age', e.target.value)}
            min="0"
          />
        </div>

         <div>
          <Label>Пол</Label>
          <Select value={filters.gender} onValueChange={(value) => updateFilter('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите пол" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любой</SelectItem>
              <SelectItem value="Мужской">Мужской</SelectItem>
              <SelectItem value="Женский">Женский</SelectItem>
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

        <Button variant="outline" onClick={resetFilters} className="w-full">
          Сбросить фильтры
        </Button>
      </CardContent>
    </Card>
  );
};
