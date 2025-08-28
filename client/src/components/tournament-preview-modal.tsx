import { useState } from "react";
import { Tournament } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Calendar,
  Clock,
  Target,
  Gamepad2,
  ArrowRight,
  Eye,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface TournamentPreviewModalProps {
  tournament: Tournament;
  children: React.ReactNode;
}

export function TournamentPreviewModal({ tournament, children }: TournamentPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const registrationProgress = (tournament.registeredPlayers / tournament.slots) * 100;

  const getStatusColor = () => {
    switch (tournament.status) {
      case 'open': return 'bg-green-500 text-white';
      case 'starting': return 'bg-yellow-500 text-black';
      case 'live': return 'bg-red-500 text-white animate-pulse';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          {children}
          <motion.div
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200 flex items-center justify-center cursor-pointer rounded-lg"
          >
            <div className="bg-white/90 dark:bg-dark-card/90 rounded-full p-2 backdrop-blur-sm">
              <Eye className="w-5 h-5 text-gray-800 dark:text-white" />
            </div>
          </motion.div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-card">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold font-mono text-gray-900 dark:text-white">
              Quick Preview
            </DialogTitle>
            <Badge className={`${getStatusColor()} font-mono font-bold`}>
              {tournament.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tournament Banner */}
          <div className="relative h-40 rounded-lg overflow-hidden">
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
            <div className="hidden absolute inset-0 bg-gradient-to-r from-primary-orange to-secondary-orange flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-2xl font-bold font-mono">{tournament.name}</h2>
              <p className="text-gray-200 text-sm mt-1">{tournament.description}</p>
            </div>
          </div>

          {/* Registration Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono font-bold text-gray-600 dark:text-gray-400">REGISTRATION PROGRESS</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{tournament.registeredPlayers}/{tournament.slots}</span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${registrationProgress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${
                  registrationProgress >= 90 ? 'bg-red-500' :
                  registrationProgress >= 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{registrationProgress.toFixed(0)}% Full</span>
              <span className={`font-bold ${
                tournament.registeredPlayers >= tournament.slots ? 'text-red-500' : 'text-green-500'
              }`}>
                {tournament.registeredPlayers >= tournament.slots ? 'FULL' : 'OPEN'}
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold font-mono text-green-800 dark:text-green-300">₹{tournament.slotPrice}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Entry Fee</div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold font-mono text-blue-800 dark:text-blue-300">₹{tournament.prizePool.toLocaleString()}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Prize Pool</div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold font-mono text-purple-800 dark:text-purple-300">{tournament.matchCount || 3}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Matches</div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <div className="text-sm font-bold font-mono text-orange-800 dark:text-orange-300">
                {format(tournament.startTime, 'MMM dd, HH:mm')}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">Start Time</div>
            </div>
          </div>

          {/* Tournament Details */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono">
                {tournament.gameMode === 'BR' ? 'Battle Royale' : 'Clash Squad'}
              </Badge>
              <Badge variant="secondary" className="font-mono">
                {tournament.type.toUpperCase()}
              </Badge>
              {tournament.device && (
                <Badge variant="secondary" className="font-mono">
                  {tournament.device}
                </Badge>
              )}
            </div>

            {tournament.rules && (
              <div>
                <h3 className="text-sm font-bold font-mono text-gray-900 dark:text-white mb-2">TOURNAMENT RULES</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {tournament.rules.length > 200 
                    ? `${tournament.rules.substring(0, 200)}...` 
                    : tournament.rules
                  }
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href={`/tournament/${tournament.id}`} className="flex-1">
              <Button 
                className="w-full bg-primary-orange hover:bg-secondary-orange text-white font-mono font-bold"
                onClick={() => setIsOpen(false)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
            </Link>
            
            {tournament.status === 'open' && tournament.registeredPlayers < tournament.slots && (
              <Button 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-mono font-bold"
                onClick={() => {
                  // This would trigger registration modal or redirect
                  setIsOpen(false);
                }}
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Join Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}