// src/components/PlayerCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Gamepad2, Users } from "lucide-react";
import { Link } from "react-router-dom"; 

// Тип пропсов для карточки
interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    avatar?: string;
    location: string;
    sport: string;
    experience: string;
    teamStatus: "looking" | "has-team" | "not-looking";
  };
}

const getTeamStatusBadge = (status: "looking" | "has-team" | "not-looking") => {
  switch (status) {
    case "looking": return <Badge className="bg-green-100 text-green-800 border-green-200">Ищет команду</Badge>;
    case "has-team": return <Badge variant="secondary">В команде</Badge>;
    case "not-looking": return <Badge variant="outline">Не ищет</Badge>;
    default: return null;
  }
};

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    // Оборачиваем Card в Link, который ведет на страницу профиля
    <Link to={`/player/${player.id}`} className="block hover:shadow-lg transition-shadow rounded-lg">
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback className="text-xl">
                {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{player.name}</CardTitle>
              <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{player.location}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Gamepad2 className="h-3 w-3" /> {player.sport}
            </Badge>
            <Badge variant="outline">{player.experience}</Badge>
            {getTeamStatusBadge(player.teamStatus)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};