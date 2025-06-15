// src/components/PlayerCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

// Интерфейс для данных, которые получает компонент
interface PlayerCardData {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  teamStatus: "looking" | "has-team" | "not-looking";
  sport: string;
  experience: string;
  sport2?: string;
  experience2?: string;
}

// Пропсы компонента
interface PlayerCardProps {
  player: PlayerCardData;
}

// Вспомогательная функция для статуса
const getTeamStatusBadge = (status: "looking" | "has-team" | "not-looking") => {
  switch (status) {
    case "looking":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Ищет команду
        </Badge>
      );
    case "has-team":
      return <Badge variant="secondary">В команде</Badge>;
    case "not-looking":
      return <Badge variant="outline">Не ищет</Badge>;
    default:
      return null;
  }
};

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <Link
      to={`/player/${player.id}`}
      className="block hover:shadow-lg transition-shadow rounded-lg h-full"
    >
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback className="text-xl">
                {player.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{player.name}</CardTitle>
              <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{player.location}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow justify-end space-y-2">
          {/* Статус поиска команды */}
          <div>{getTeamStatusBadge(player.teamStatus)}</div>

          {/* Контейнер для видов спорта */}
          <div className="space-y-2">
            {/* Первый вид спорта */}
            <div className="flex items-center gap-2 text-sm">
              <Gamepad2 className="h-4 w-4 text-gray-500" />
              <span>{player.sport}:</span>
              <Badge variant="secondary">{player.experience}</Badge>
            </div>

            {/* Второй вид спорта (если есть) */}
            {player.sport2 && (
              <div className="flex items-center gap-2 text-sm">
                <Gamepad2 className="h-4 w-4 text-sky-600" />
                <span>{player.sport2}:</span>
                <Badge className="bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200">
                  {player.experience2}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
