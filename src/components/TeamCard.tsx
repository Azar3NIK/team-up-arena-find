// src/components/TeamCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

// Пропсы для карточки
interface TeamCardProps {
  team: {
    id: string;
    name: string;
    logo?: string | null;
    sport: string | null;
    level: string | null;
    membersCount: number;
  };
}

export const TeamCard = ({ team }: TeamCardProps) => {
  return (
    // Оборачиваем всю карточку в Link
    <Link to={`/team/${team.id}`} className="block hover:shadow-lg transition-shadow rounded-lg h-full">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={team.logo || undefined} alt={team.name} />
              <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{team.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div className="flex flex-wrap gap-2">
            {team.sport && <Badge variant="outline">{team.sport}</Badge>}
            {team.level && <Badge variant="secondary">{team.level}</Badge>}
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>{team.membersCount} участников</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};