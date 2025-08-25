import { Tournament } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "Registration Open", className: "bg-green-100 text-green-800" },
      starting: { label: "Starting Soon", className: "bg-yellow-100 text-yellow-800" },
      live: { label: "Live", className: "bg-red-100 text-red-800" },
      completed: { label: "Completed", className: "bg-gray-100 text-gray-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return (
      <Badge className={config.className}>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
          {config.label}
        </div>
      </Badge>
    );
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      "from-primary-orange to-secondary-orange",
      "from-purple-500 to-purple-600",
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-pink-500 to-pink-600",
    ];
    return gradients[index % gradients.length];
  };

  const timeUntilStart = tournament.startTime ? new Date(tournament.startTime).getTime() - Date.now() : 0;
  const hoursUntilStart = Math.max(0, Math.floor(timeUntilStart / (1000 * 60 * 60)));
  const minutesUntilStart = Math.max(0, Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2" data-testid={`tournament-card-${tournament.id}`}>
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={`/api/tournament-banner/${tournament.id}`}
          alt={`${tournament.name} banner`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className={`hidden absolute inset-0 bg-gradient-to-r ${getGradientColor(parseInt(tournament.id))}`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex justify-between items-end text-white">
            <div>
              <h3 className="text-lg font-semibold" data-testid={`text-tournament-name-${tournament.id}`}>
                {tournament.name}
              </h3>
              <p className="text-sm opacity-90 capitalize">{tournament.type} Tournament</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold" data-testid={`text-prize-pool-${tournament.id}`}>
                ₹{tournament.prizePool.toLocaleString()}
              </div>
              <div className="text-xs opacity-90">Prize Pool</div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge(tournament.status)}
          <span className="text-sm text-gray-500 flex items-center" data-testid={`text-time-remaining-${tournament.id}`}>
            <Clock className="w-4 h-4 mr-1" />
            {hoursUntilStart > 0 || minutesUntilStart > 0
              ? `Starts in ${hoursUntilStart}h ${minutesUntilStart}m`
              : "Starting soon"
            }
          </span>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Players
            </span>
            <span className="font-medium" data-testid={`text-players-${tournament.id}`}>
              {tournament.registeredPlayers} / {tournament.slots}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Entry Fee
            </span>
            <span className="font-medium" data-testid={`text-entry-fee-${tournament.id}`}>
              ₹{tournament.slotPrice}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Format</span>
            <span className="font-medium">{tournament.format}</span>
          </div>
        </div>
        
        <Link href={`/tournament/${tournament.id}`}>
          <Button 
            className={`w-full bg-gradient-to-r ${getGradientColor(parseInt(tournament.id))} text-white hover:shadow-lg transition-all duration-300`}
            data-testid={`button-join-tournament-${tournament.id}`}
          >
            {tournament.status === "open" ? "Join Tournament" : "View Details"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
