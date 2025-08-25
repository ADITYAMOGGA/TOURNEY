import { useQuery } from "@tanstack/react-query"
import { Tournament } from "@shared/schema"
import { Link } from "wouter"
import TournamentCard from "./tournament-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Users, Calendar, Filter } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PublicSection() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'starting' | 'live'>('all')
  const [gameModeFilter, setGameModeFilter] = useState<'all' | 'br' | 'cs' | 'limited' | 'unlimited' | 'contra' | 'statewar'>('all')
  const [showFilters, setShowFilters] = useState(false)
  
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  })

  const filteredTournaments = tournaments?.filter(tournament => {
    // Status filter
    const statusMatch = statusFilter === 'all' || tournament.status === statusFilter
    
    // Game mode filter
    let gameModeMatch = true
    if (gameModeFilter === 'br') {
      gameModeMatch = tournament.gameMode === 'BR'
    } else if (gameModeFilter === 'cs') {
      gameModeMatch = tournament.gameMode === 'CS'
    } else if (gameModeFilter === 'limited') {
      gameModeMatch = tournament.gameMode === 'CS' && tournament.csGameVariant === 'Limited'
    } else if (gameModeFilter === 'unlimited') {
      gameModeMatch = tournament.gameMode === 'CS' && tournament.csGameVariant === 'Unlimited'
    } else if (gameModeFilter === 'contra') {
      gameModeMatch = tournament.gameMode === 'CS' && tournament.csGameVariant === 'Contra'
    } else if (gameModeFilter === 'statewar') {
      gameModeMatch = tournament.gameMode === 'CS' && tournament.csGameVariant === 'StateWar'
    }
    
    return statusMatch && gameModeMatch
  }) || []

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Tournament Browser</h2>
        <p className="text-lg opacity-90 mb-6">
          Discover and join exciting gaming tournaments happening now
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/tournaments">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" data-testid="button-browse-all">
              <Trophy className="w-5 h-5 mr-2" />
              Browse All Tournaments
            </Button>
          </Link>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-200" data-testid="button-join-community">
            <Users className="w-5 h-5 mr-2" />
            Join Community
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {tournaments?.filter(t => t.status === 'live').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Registration</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {tournaments?.filter(t => t.status === 'open').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Available to join</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starting Soon</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {tournaments?.filter(t => t.status === 'starting').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">About to begin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
            <Trophy className="h-4 w-4 text-primary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{tournaments?.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Available rewards</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-dark-bg">Available Tournaments</h3>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            data-testid="toggle-filters"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(statusFilter !== 'all' || gameModeFilter !== 'all') && (
              <span className="w-2 h-2 bg-primary-orange rounded-full"></span>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex flex-col gap-4">
                {/* Status Filters */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                      data-testid="filter-status-all"
                    >
                      All Status
                    </Button>
                    <Button
                      variant={statusFilter === 'open' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('open')}
                      data-testid="filter-status-open"
                    >
                      Open
                    </Button>
                    <Button
                      variant={statusFilter === 'starting' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('starting')}
                      data-testid="filter-status-starting"
                    >
                      Starting
                    </Button>
                    <Button
                      variant={statusFilter === 'live' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('live')}
                      data-testid="filter-status-live"
                    >
                      Live
                    </Button>
                  </div>
                </div>
                
                {/* Game Mode Filters */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Game Mode</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={gameModeFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGameModeFilter('all')}
                      data-testid="filter-gamemode-all"
                      className="bg-gradient-to-r from-primary-orange to-secondary-orange text-white hover:shadow-lg"
                    >
                      All Games
                    </Button>
                    <Button
                      variant={gameModeFilter === 'br' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGameModeFilter('br')}
                      data-testid="filter-gamemode-br"
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      BR Full Map
                    </Button>
                    <Button
                      variant={gameModeFilter === 'cs' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGameModeFilter('cs')}
                      data-testid="filter-gamemode-cs"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Clash Squad
                    </Button>
                    <Button
                      variant={gameModeFilter === 'limited' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGameModeFilter('limited')}
                      data-testid="filter-gamemode-limited"
                      className="bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Limited
                    </Button>
                    <Button
                      variant={gameModeFilter === 'unlimited' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGameModeFilter('unlimited')}
                      data-testid="filter-gamemode-unlimited"
                      className="bg-purple-500 text-white hover:bg-purple-600"
                    >
                      Unlimited
                    </Button>
                    <Button
                      variant={gameModeFilter === 'contra' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGameModeFilter('contra')}
                      data-testid="filter-gamemode-contra"
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Contra
                    </Button>
                    <Button
                      variant={gameModeFilter === 'statewar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGameModeFilter('statewar')}
                      data-testid="filter-gamemode-statewar"
                      className="bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                      StateWar
                    </Button>
                  </div>
                </div>

                {/* Clear Filters */}
                {(statusFilter !== 'all' || gameModeFilter !== 'all') && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStatusFilter('all')
                        setGameModeFilter('all')
                      }}
                      data-testid="clear-filters"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="h-24 bg-gray-200">
                      <Skeleton className="w-full h-full" />
                    </div>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-10 w-full mt-6" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : filteredTournaments.length === 0 ? (
              <motion.div 
                key="no-tournaments"
                className="col-span-full text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-md mx-auto">
                  <motion.div 
                    className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Trophy className="w-16 h-16 text-gray-400" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">No Tournaments Yet</h4>
                  <p className="text-gray-600 mb-8 text-lg">
                    Be the first to discover amazing tournaments! Check back soon or create your own.
                  </p>
                  <div className="text-center text-gray-500">
                    <p className="text-sm">Organizers can create tournaments to get started</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              filteredTournaments.slice(0, 6).map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1 
                  }}
                  layout
                >
                  <TournamentCard tournament={tournament} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {filteredTournaments.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/tournaments">
              <Button variant="outline" className="px-8" data-testid="button-view-more-tournaments">
                View More Tournaments
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}