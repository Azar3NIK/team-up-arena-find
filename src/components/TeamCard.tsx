
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    logo?: string;
    location: string;
    sport: string;
    level: string;
    foundedYear: number;
    membersCount: number;
    description: string;
  };
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/team/${team.id}`)}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={team.logo} alt={team.name} />
            <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate">{team.name}</h3>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{team.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Основана в {team.foundedYear}</span>
              </div>
              <p className="text-sm text-gray-500">Уровень: {team.level}</p>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Users className="h-3 w-3" />
              <span>Число игроков: {team.membersCount}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{team.description}</p>
            
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline">{team.sport}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
