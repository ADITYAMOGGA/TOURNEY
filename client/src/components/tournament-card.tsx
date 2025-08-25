import { Tournament } from "@shared/schema";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Trophy, 
  Users, 
  DollarSign, 
  Calendar,
  Clock,
  Smartphone,
  Monitor,
  Target,
  Gamepad2
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  // Get device icon and text
  const getDeviceInfo = () => {
    if (tournament.device) {
      switch (tournament.device.toLowerCase()) {
        case 'mobile':
          return { icon: <Smartphone className="w-4 h-4" />, text: 'MOBILE' };
        case 'pc':
          return { icon: <Monitor className="w-4 h-4" />, text: 'PC' };
        case 'both':
          return { icon: <Gamepad2 className="w-4 h-4" />, text: 'MOBILE/PC' };
        default:
          return { icon: <Smartphone className="w-4 h-4" />, text: 'MOBILE' };
      }
    }
    // Default based on game mode if device field is not available
    if (tournament.gameMode === 'BR') {
      return { icon: <Smartphone className="w-4 h-4" />, text: 'MOBILE' };
    }
    return { icon: <Monitor className="w-4 h-4" />, text: 'PC' };
  };

  return (
    <Link href={`/tournament/${tournament.id}`}>
      <motion.div
        className="bg-white border-2 border-black overflow-hidden cursor-pointer h-[420px] relative"
        data-testid={`card-tournament-${tournament.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
          borderColor: "hsl(var(--primary-orange))"
        }}
        transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
      >
        {/* Tournament Banner */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(/api/tournament-banner/${tournament.id})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 text-xs font-bold font-mono border-2 ${
              tournament.status === 'open' ? 'bg-green-500 border-green-600 text-white' :
              tournament.status === 'starting' ? 'bg-yellow-500 border-yellow-600 text-black' :
              tournament.status === 'live' ? 'bg-red-500 border-red-600 text-white animate-pulse' :
              'bg-gray-500 border-gray-600 text-white'
            }`}>
              {tournament.status.toUpperCase()}
            </div>
          </div>

          {/* Prize Pool Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-primary-orange border-2 border-white text-white px-3 py-1 font-mono font-bold text-sm">
              ₹{tournament.prizePool.toLocaleString()}
            </div>
          </div>

          {/* Tournament Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 
              className="text-white text-xl font-bold font-mono leading-tight"
              data-testid={`text-tournament-name-${tournament.id}`}
            >
              {tournament.name}
            </h3>
          </div>
        </div>

        {/* Tournament Details */}
        <div className="p-4 space-y-4 h-[252px] flex flex-col">
          {/* Game Mode and Type Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black text-white px-2 py-1 text-xs font-mono">
                {getDeviceInfo().icon}
                {getDeviceInfo().text}
              </div>
              <div className="bg-gray-800 text-white px-2 py-1 text-xs font-mono">
                {tournament.gameMode === 'BR' ? 'BR' : 'CS'}
              </div>
            </div>
            <div className="bg-primary-orange text-white px-2 py-1 text-xs font-mono font-bold">
              {tournament.type.toUpperCase()}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Entry Fee */}
            <div className="bg-green-50 border border-green-200 p-3 space-y-1">
              <div className="flex items-center gap-1 text-green-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">ENTRY FEE</span>
              </div>
              <div className="text-lg font-bold font-mono text-green-800" data-testid={`text-entry-fee-${tournament.id}`}>
                ₹{tournament.slotPrice}
              </div>
            </div>

            {/* Players */}
            <div className="bg-blue-50 border border-blue-200 p-3 space-y-1">
              <div className="flex items-center gap-1 text-blue-600">
                <Users className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">PLAYERS</span>
              </div>
              <div className="text-lg font-bold font-mono text-blue-800" data-testid={`text-players-${tournament.id}`}>
                {tournament.registeredPlayers}/{tournament.slots}
              </div>
            </div>

            {/* Matches */}
            <div className="bg-purple-50 border border-purple-200 p-3 space-y-1">
              <div className="flex items-center gap-1 text-purple-600">
                <Target className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">MATCHES</span>
              </div>
              <div className="text-lg font-bold font-mono text-purple-800" data-testid={`text-matches-${tournament.id}`}>
                {tournament.matchCount || 3}
              </div>
            </div>

            {/* Start Time */}
            <div className="bg-orange-50 border border-orange-200 p-3 space-y-1">
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">START</span>
              </div>
              <div className="text-sm font-bold font-mono text-orange-800" data-testid={`text-start-time-${tournament.id}`}>
                {format(tournament.startTime, 'MMM dd')}
                <br />
                <span className="text-xs">{format(tournament.startTime, 'HH:mm')}</span>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <div className="mt-auto">
            <motion.div 
              className="w-full bg-black text-white py-3 px-4 font-mono font-bold text-center border-2 border-black hover:bg-primary-orange hover:border-primary-orange transition-colors duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Gamepad2 className="w-4 h-4" />
              JOIN TOURNAMENT
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}