
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TeamFiltersProps {
  filters: {
    search: string;
    sport: string;
    location: string;
    level: string;
    foundedYear: string;
    isRecruiting: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export const TeamFilters = ({ filters, onFiltersChange }: TeamFiltersProps) => {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      sport: '',
      location: '',
      level: '',
      foundedYear: '',
      isRecruiting: false
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры поиска команд</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Название команды</Label>
          <Input
            id="search"
            placeholder="Введите название команды"
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
          <Label>Уровень подготовки команды</Label>
          <Select value={filters.level} onValueChange={(value) => updateFilter('level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень" />
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
          <Label>Год создания команды</Label>
          <Input
            type="number"
            placeholder="Введите год"
            value={filters.foundedYear}
            onChange={(e) => updateFilter('foundedYear', e.target.value)}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recruiting"
              checked={filters.isRecruiting}
              onCheckedChange={(checked) => updateFilter('isRecruiting', checked as boolean)}
            />
            <Label htmlFor="recruiting">Только команды с открытым набором</Label>
          </div>
        </div>

        <Button variant="outline" onClick={resetFilters} className="w-full">
          Сбросить фильтры
        </Button>
      </CardContent>
    </Card>
  );
};
