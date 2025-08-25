import { Tournament } from "@shared/schema";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <Link href={`/tournament/${tournament.id}`}>
      <motion.div
        className="mono-card h-96 relative cursor-pointer overflow-hidden border-2"
        data-testid={`card-tournament-${tournament.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          borderColor: "hsl(0 0% 8%)"
        }}
        transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/api/tournament-banner/${tournament.id})`
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
        
        {/* Content Grid */}
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="p-6 flex justify-between items-start">
            <div className="bg-white/90 backdrop-blur-sm border border-black/10 px-3 py-1">
              <span className="text-xs font-mono font-medium text-black">
                {tournament.gameMode === 'BR' ? 'BR' : 'CS'}
              </span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-black/10 px-3 py-1">
              <span className="text-xs font-mono font-medium text-black">
                ${tournament.prizePool.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Middle Section - Status */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div 
              className={`px-4 py-2 border-2 font-mono text-sm font-bold ${
                tournament.status === 'open' ? 'bg-green-500 border-green-600 text-white' :
                tournament.status === 'starting' ? 'bg-yellow-500 border-yellow-600 text-black' :
                tournament.status === 'live' ? 'bg-red-500 border-red-600 text-white' :
                'bg-gray-500 border-gray-600 text-white'
              }`}
              data-testid={`badge-status-${tournament.id}`}
              whileHover={{ scale: 1.05 }}
            >
              {tournament.status.toUpperCase()}
            </motion.div>
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-white/95 backdrop-blur-sm border-t-2 border-black">
            <div className="space-y-3">
              <h3 
                className="text-lg font-bold text-black tracking-tight"
                data-testid={`text-tournament-name-${tournament.id}`}
              >
                {tournament.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs bg-black text-white px-2 py-1 font-mono">
                    {tournament.type.toUpperCase()}
                  </span>
                  {tournament.gameMode === 'CS' && tournament.csGameVariant && (
                    <span className="text-xs bg-gray-200 text-black px-2 py-1 font-mono border">
                      {tournament.csGameVariant}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-black" data-testid={`text-players-${tournament.id}`}>
                    {tournament.registeredPlayers}/{tournament.slots}
                  </div>
                  <div className="text-xs text-gray-600 font-mono">
                    {format(tournament.startTime, 'MMM dd, HH:mm')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <motion.div 
            className="absolute top-6 right-6 w-8 h-8 bg-black border-2 border-white flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}