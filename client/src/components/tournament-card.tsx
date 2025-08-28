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
  Gamepad2,
  Activity,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TournamentPreviewModal } from "./tournament-preview-modal";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  // Calculate registration progress
  const registrationProgress = (tournament.registeredPlayers / tournament.slots) * 100;
  
  // Get status info with colors and icons
  const getStatusInfo = () => {
    switch (tournament.status) {
      case 'open':
        return {
          color: 'bg-green-500 border-green-600 text-white',
          icon: <PlayCircle className="w-3 h-3" />,
          label: 'OPEN'
        };
      case 'starting':
        return {
          color: 'bg-yellow-500 border-yellow-600 text-black',
          icon: <Clock className="w-3 h-3" />,
          label: 'STARTING'
        };
      case 'live':
        return {
          color: 'bg-red-500 border-red-600 text-white animate-pulse',
          icon: <Activity className="w-3 h-3" />,
          label: 'LIVE'
        };
      case 'completed':
        return {
          color: 'bg-gray-500 border-gray-600 text-white',
          icon: <CheckCircle className="w-3 h-3" />,
          label: 'ENDED'
        };
      default:
        return {
          color: 'bg-gray-500 border-gray-600 text-white',
          icon: <Clock className="w-3 h-3" />,
          label: 'UNKNOWN'
        };
    }
  };

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

  const statusInfo = getStatusInfo();
  const deviceInfo = getDeviceInfo();

  return (
    <TournamentPreviewModal tournament={tournament}>
      <motion.div
        className="bg-white dark:bg-dark-card border-2 border-black dark:border-gray-600 overflow-hidden cursor-pointer h-[460px] relative group"
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
          <img
            src={`/api/tournament-banner/${tournament.id}`}
            alt={`${tournament.name} tournament banner`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="hidden absolute inset-0 bg-gradient-to-r from-primary-orange to-secondary-orange flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`px-3 py-1 text-xs font-bold font-mono border-2 flex items-center gap-1 ${statusInfo.color}`}>
              {statusInfo.icon}
              {statusInfo.label}
            </Badge>
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
        <div className="p-4 space-y-4 h-[292px] flex flex-col">
          {/* Registration Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400 font-mono">REGISTRATION PROGRESS</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{tournament.registeredPlayers}/{tournament.slots}</span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  registrationProgress >= 90 ? 'bg-red-500' :
                  registrationProgress >= 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${registrationProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {registrationProgress.toFixed(0)}% FULL
            </div>
          </div>
          
          {/* Game Mode and Type Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-2 py-1 text-xs font-mono">
                {deviceInfo.icon}
                {deviceInfo.text}
              </Badge>
              <Badge className="bg-gray-800 dark:bg-gray-600 text-white px-2 py-1 text-xs font-mono">
                {tournament.gameMode === 'BR' ? 'BR' : 'CS'}
              </Badge>
            </div>
            <Badge className="bg-primary-orange text-white px-2 py-1 text-xs font-mono font-bold">
              {tournament.type.toUpperCase()}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Entry Fee */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 space-y-1 transition-colors">
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">ENTRY FEE</span>
              </div>
              <div className="text-lg font-bold font-mono text-green-800 dark:text-green-300" data-testid={`text-entry-fee-${tournament.id}`}>
                ₹{tournament.slotPrice}
              </div>
            </div>

            {/* Players */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 space-y-1 transition-colors">
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Users className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">PLAYERS</span>
              </div>
              <div className="text-lg font-bold font-mono text-blue-800 dark:text-blue-300" data-testid={`text-players-${tournament.id}`}>
                {tournament.registeredPlayers}/{tournament.slots}
              </div>
            </div>

            {/* Matches */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3 space-y-1 transition-colors">
              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Target className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">MATCHES</span>
              </div>
              <div className="text-lg font-bold font-mono text-purple-800 dark:text-purple-300" data-testid={`text-matches-${tournament.id}`}>
                {tournament.matchCount || 3}
              </div>
            </div>

            {/* Start Time */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3 space-y-1 transition-colors">
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">START</span>
              </div>
              <div className="text-sm font-bold font-mono text-orange-800 dark:text-orange-300" data-testid={`text-start-time-${tournament.id}`}>
                {format(tournament.startTime, 'MMM dd')}
                <br />
                <span className="text-xs">{format(tournament.startTime, 'HH:mm')}</span>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <div className="mt-auto">
            <motion.div 
              className={`w-full py-3 px-4 font-mono font-bold text-center border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                tournament.status === 'open' && tournament.registeredPlayers < tournament.slots
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-primary-orange hover:border-primary-orange hover:text-white'
                  : 'bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed'
              }`}
              whileHover={tournament.status === 'open' && tournament.registeredPlayers < tournament.slots ? { scale: 1.02 } : {}}
              whileTap={tournament.status === 'open' && tournament.registeredPlayers < tournament.slots ? { scale: 0.98 } : {}}
            >
              <Gamepad2 className="w-4 h-4" />
              {tournament.status === 'open' && tournament.registeredPlayers < tournament.slots 
                ? 'JOIN TOURNAMENT'
                : tournament.registeredPlayers >= tournament.slots
                ? 'TOURNAMENT FULL'
                : tournament.status.toUpperCase()
              }
              {tournament.status === 'open' && tournament.registeredPlayers < tournament.slots && (
                <ArrowRight className="w-4 h-4" />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </TournamentPreviewModal>
  )
}