
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    avatar?: string;
    position: string;
    rating: number;
    location: string;
    sport: string;
    experience: string;
    teamStatus: 'looking' | 'has-team' | 'not-looking';
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
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{player.rating}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-600">{player.position}</p>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{player.location}</span>
              </div>
              <p className="text-sm text-gray-500">Опыт: {player.experience}</p>
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
