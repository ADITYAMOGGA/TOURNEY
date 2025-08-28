import { useQuery } from "@tanstack/react-query"
import { Tournament } from "@shared/schema"
import { Link } from "wouter"
import TournamentCard from "./tournament-card"
import PromotedBanner from "./promoted-banner"
import { TournamentCardSkeleton } from "./tournament-card-skeleton"
import { NoSearchResults, NoFilterResults, NoTournaments } from "./empty-states"
import { Button } from "@/components/ui/button"
import { AdvancedSearch } from "./advanced-search"
import { Filter } from "lucide-react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PublicSectionProps {
  searchQuery?: string
}

export default function PublicSection({ searchQuery = '' }: PublicSectionProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'starting' | 'live'>('all')
  const [gameModeFilter, setGameModeFilter] = useState<'all' | 'br' | 'cs' | 'limited' | 'unlimited' | 'contra' | 'statewar'>('all')
  const [showFilters, setShowFilters] = useState(false)
  
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  })

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

  return (
    <div className="space-y-8">
      {/* Promoted Banner - Netflix Style */}
      <PromotedBanner />

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
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
                        { key: 'all', label: 'ALL MODES' },
                        { key: 'br', label: 'BATTLE ROYALE' },
                        { key: 'cs', label: 'CLASH SQUAD' },
                        { key: 'limited', label: 'CS LIMITED' },
                        { key: 'unlimited', label: 'CS UNLIMITED' },
                        { key: 'contra', label: 'CONTRA' },
                        { key: 'statewar', label: 'STATE WAR' }
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
                  {(statusFilter !== 'all' || gameModeFilter !== 'all') && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => {
                          setStatusFilter('all')
                          setGameModeFilter('all')
                        }}
                        variant="outline"
                        className="font-mono border-2 border-gray-300 text-gray-600 hover:border-black hover:text-black"
                      >
                        CLEAR ALL FILTERS
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Tournament Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 font-mono">
            {searchQuery ? `SEARCH RESULTS FOR "${searchQuery}"` : 'ALL TOURNAMENTS'}
          </h3>
          <p className="text-gray-600">
            {!isLoading && `${filteredTournaments.length} tournament${filteredTournaments.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <TournamentCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTournaments.length === 0 ? (
          <>
            {!tournaments?.length ? (
              <NoTournaments />
            ) : searchQuery ? (
              <NoSearchResults searchQuery={searchQuery} />
            ) : (statusFilter !== 'all' || gameModeFilter !== 'all') ? (
              <NoFilterResults 
                onClearFilters={() => {
                  setStatusFilter('all')
                  setGameModeFilter('all')
                }} 
              />
            ) : (
              <NoTournaments />
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}