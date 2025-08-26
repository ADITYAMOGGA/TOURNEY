import { useQuery } from "@tanstack/react-query";
import { Tournament } from "@shared/schema";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trophy, Users, Calendar, Play, Star, Smartphone } from "lucide-react";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function PromotedBanner() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  
  const { data: tournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  // Filter promoted tournaments
  const promotedTournaments = tournaments?.filter(t => t.isPromoted && t.promotionPaid) || [];

  if (promotedTournaments.length === 0) {
    return (
      <div className="w-full h-[60vh] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">No Promoted Tournaments</h2>
          <p className="text-gray-400 text-lg">Check back later for featured tournaments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[60vh] relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {promotedTournaments.map((tournament) => (
            <CarouselItem key={tournament.id} className="h-full">
              <PromotedTournamentCard tournament={tournament} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-black/50 text-white border-none hover:bg-black/70" />
        <CarouselNext className="right-4 bg-black/50 text-white border-none hover:bg-black/70" />
      </Carousel>
    </div>
  );
}

function PromotedTournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600"
        style={{
          background: `linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #7c3aed 100%)`
        }}
      />
      
      {/* Content overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Main content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-5xl px-8 md:px-12 text-white w-full">
          {/* Promoted badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-500 px-4 py-2 rounded-full flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-black font-bold text-sm uppercase tracking-wider">PROMOTED</span>
            </div>
            <span className="bg-primary-orange px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
              {tournament.gameMode === 'BR' ? 'BATTLE ROYALE' : 'CLASH SQUAD'}
            </span>
            <span className="bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
              {tournament.format}
            </span>
          </div>
          
          {/* Tournament name */}
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            {tournament.name}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            {tournament.description || `Join the ultimate ${tournament.format} tournament with amazing prizes!`}
          </p>
          
          {/* Tournament stats */}
          <div className="flex flex-wrap gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-sm text-gray-300">Prize Pool</div>
                <div className="text-2xl font-bold">₹{tournament.prizePool.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-sm text-gray-300">Players</div>
                <div className="text-2xl font-bold">{tournament.registeredPlayers}/{tournament.slots}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-sm text-gray-300">Starts</div>
                <div className="text-xl font-bold">{format(new Date(tournament.startTime), 'MMM dd, HH:mm')}</div>
              </div>
            </div>
            
            {tournament.device && (
              <div className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-300">Device</div>
                  <div className="text-xl font-bold">{tournament.device}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Link href={`/tournament/${tournament.id}`} className="flex-1">
              <Button 
                size="lg" 
                className="w-full bg-primary-orange hover:bg-orange-600 text-white font-bold px-6 py-3 text-base"
                data-testid={`button-join-${tournament.id}`}
              >
                <Play className="w-4 h-4 mr-2" />
                JOIN NOW
              </Button>
            </Link>
            
            <Link href={`/tournament/${tournament.id}`} className="flex-1">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-black font-bold px-6 py-3 text-base"
                data-testid={`button-details-${tournament.id}`}
              >
                VIEW DETAILS
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Entry fee badge */}
      <div className="absolute top-6 right-6 bg-white text-black px-4 py-2 rounded-lg font-bold">
        Entry: ₹{tournament.slotPrice}
      </div>
    </div>
  );
}