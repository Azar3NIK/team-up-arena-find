
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin,  Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    avatar?: string;
    location: string;
    sport: string;
    experience: string;
    teamStatus: 'looking' | 'has-team' | 'not-looking';
    age: number;
    gender: string;
  };
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const navigate = useNavigate();

  const getTeamStatusBadge = (status: string) => {
    switch (status) {
      case 'looking':
        return <Badge variant="default" className="bg-green-500">Ищет команду</Badge>;
      case 'has-team':
        return <Badge variant="secondary">В команде</Badge>;
      case 'not-looking':
        return <Badge variant="outline">Не ищет</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/player/${player.id}`)}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={player.avatar} alt={player.name} />
            <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate">{player.name}</h3>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{player.location}</span>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-gray-500">Возраст: {player.age}</p>
                <p className="text-sm text-gray-500">Пол: {player.gender}</p>
              </div>
              <p className="text-sm text-gray-500">Уровень игры: {player.experience}</p>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline">{player.sport}</Badge>
              {getTeamStatusBadge(player.teamStatus)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
