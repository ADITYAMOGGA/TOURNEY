import { useQuery } from "@tanstack/react-query"
import { Tournament } from "@shared/schema"
import { Link } from "wouter"
import TournamentCard from "./tournament-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Trophy, Users, Calendar, Search, Filter, Play, Star } from "lucide-react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

export default function PublicSection() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'starting' | 'live'>('all')
  const [gameModeFilter, setGameModeFilter] = useState<'all' | 'br' | 'cs' | 'limited' | 'unlimited' | 'contra' | 'statewar'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  })

  const featuredTournaments = useMemo(() => {
    return tournaments?.filter(t => t.prizePool > 10000).slice(0, 5) || []
  }, [tournaments])

  const filteredTournaments = useMemo(() => {
    return tournaments?.filter(tournament => {
      // Search filter
      const searchMatch = !searchQuery || 
        tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.description?.toLowerCase().includes(searchQuery.toLowerCase())

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
      
      return searchMatch && statusMatch && gameModeMatch
    }) || []
  }, [tournaments, searchQuery, statusFilter, gameModeFilter])

  const FeaturedTournamentCard = ({ tournament }: { tournament: Tournament }) => (
    <div className="relative w-full h-[500px] overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/api/tournament-banner/${tournament.id})`
        }}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-2xl px-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary-orange px-3 py-1 text-xs font-bold uppercase tracking-wider">
              FEATURED
            </span>
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              tournament.status === 'open' ? 'bg-green-500' :
              tournament.status === 'starting' ? 'bg-yellow-500 text-black' :
              tournament.status === 'live' ? 'bg-red-500' : 'bg-gray-500'
            }`}>
              {tournament.status}
            </span>
          </div>
          
          <h2 className="text-5xl font-bold mb-4 font-mono tracking-tight">
            {tournament.name}
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
            {tournament.description || "Join the ultimate gaming tournament and compete for massive prizes!"}
          </p>
          
          <div className="flex items-center gap-8 mb-8 text-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary-orange" />
              <span className="font-bold">${tournament.prizePool.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary-orange" />
              <span>{tournament.registeredPlayers}/{tournament.slots}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary-orange" />
              <span>{format(tournament.startTime, 'MMM dd, HH:mm')}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href={`/tournament/${tournament.id}`}>
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-bold transition-all duration-200">
                <Play className="w-5 h-5 mr-2" />
                JOIN NOW
              </Button>
            </Link>
            <Link href={`/tournament/${tournament.id}`}>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-bold transition-all duration-200">
                <Star className="w-5 h-5 mr-2" />
                VIEW DETAILS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-12">
      {/* Featured Tournaments Carousel */}
      {!isLoading && featuredTournaments.length > 0 && (
        <section>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {featuredTournaments.map((tournament) => (
                <CarouselItem key={tournament.id}>
                  <FeaturedTournamentCard tournament={tournament} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>
      )}

      {/* Search and Filters Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-3xl font-bold mb-2 font-mono">DISCOVER TOURNAMENTS</h3>
            <p className="text-gray-600">Find the perfect tournament to showcase your skills</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg border-2 border-black focus:border-primary-orange"
                data-testid="input-search-tournaments"
              />
            </div>
            
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 font-mono border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 px-6 py-3"
              data-testid="toggle-filters"
            >
              <Filter className="w-5 h-5" />
              FILTERS
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
                className="p-6 bg-white border-2 border-black"
              >
                <div className="flex flex-col gap-6">
                  {/* Status Filters */}
                  <div>
                    <h4 className="text-sm font-mono font-bold uppercase tracking-wider mb-3">STATUS</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'all', label: 'ALL STATUS' },
                        { key: 'open', label: 'OPEN' },
                        { key: 'starting', label: 'STARTING' },
                        { key: 'live', label: 'LIVE' }
                      ].map(({ key, label }) => (
                        <Button
                          key={key}
                          size="sm"
                          onClick={() => setStatusFilter(key as any)}
                          className={`font-mono border-2 border-black transition-all duration-200 ${
                            statusFilter === key 
                              ? 'bg-black text-white' 
                              : 'bg-white text-black hover:bg-black hover:text-white'
                          }`}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Game Mode Filters */}
                  <div>
                    <h4 className="text-sm font-mono font-bold uppercase tracking-wider mb-3">GAME MODE</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'all', label: 'ALL GAMES' },
                        { key: 'br', label: 'BR FULL MAP' },
                        { key: 'cs', label: 'CLASH SQUAD' },
                        { key: 'limited', label: 'LIMITED' },
                        { key: 'unlimited', label: 'UNLIMITED' },
                        { key: 'contra', label: 'CONTRA' },
                        { key: 'statewar', label: 'STATEWAR' }
                      ].map(({ key, label }) => (
                        <Button
                          key={key}
                          size="sm"
                          onClick={() => setGameModeFilter(key as any)}
                          className={`font-mono border-2 border-black transition-all duration-200 ${
                            gameModeFilter === key 
                              ? 'bg-black text-white' 
                              : 'bg-white text-black hover:bg-black hover:text-white'
                          }`}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(statusFilter !== 'all' || gameModeFilter !== 'all' || searchQuery) && (
                    <div className="pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => {
                          setStatusFilter('all')
                          setGameModeFilter('all')
                          setSearchQuery('')
                        }}
                        className="font-mono font-bold text-black hover:bg-black hover:text-white border-2 border-black bg-white transition-all duration-200"
                      >
                        CLEAR ALL
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="h-96 bg-gray-200 animate-pulse border-2">
                    <Skeleton className="w-full h-full" />
                  </div>
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
                    className="w-32 h-32 bg-gray-100 border-2 border-black flex items-center justify-center mx-auto mb-6"
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
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 font-mono">NO TOURNAMENTS FOUND</h4>
                  <p className="text-gray-600 mb-8 text-lg">
                    {searchQuery || statusFilter !== 'all' || gameModeFilter !== 'all' 
                      ? "Try adjusting your filters or search terms"
                      : "New tournaments are added regularly. Check back soon!"}
                  </p>
                  {(searchQuery || statusFilter !== 'all' || gameModeFilter !== 'all') && (
                    <Button
                      onClick={() => {
                        setSearchQuery('')
                        setStatusFilter('all')
                        setGameModeFilter('all')
                      }}
                      className="bg-black text-white hover:bg-gray-800 font-mono"
                    >
                      CLEAR FILTERS
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              filteredTournaments.map((tournament, index) => (
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
      </section>
    </div>
  )
}