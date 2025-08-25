import { useQuery } from "@tanstack/react-query"
import { Tournament } from "@shared/schema"
import { Link } from "wouter"
import TournamentCard from "./tournament-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Users, Calendar, Filter } from "lucide-react"
import { useState } from "react"

export default function PublicSection() {
  const [filter, setFilter] = useState<'all' | 'open' | 'starting' | 'live'>('all')
  
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  })

  const filteredTournaments = tournaments?.filter(tournament => 
    filter === 'all' || tournament.status === filter
  ) || []

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
          <Link href="/my-registrations">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-200 opacity-100" data-testid="button-my-registrations">
              <Users className="w-5 h-5 mr-2" />
              My Registrations
            </Button>
          </Link>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-dark-bg">Available Tournaments</h3>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              data-testid="filter-all"
            >
              All
            </Button>
            <Button
              variant={filter === 'open' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('open')}
              data-testid="filter-open"
            >
              Open
            </Button>
            <Button
              variant={filter === 'starting' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('starting')}
              data-testid="filter-starting"
            >
              Starting
            </Button>
            <Button
              variant={filter === 'live' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('live')}
              data-testid="filter-live"
            >
              Live
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-24 bg-gray-200">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full mt-6" />
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-16 h-16 text-gray-400" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">No Tournaments Yet</h4>
                <p className="text-gray-600 mb-8 text-lg">
                  Be the first to discover amazing tournaments! Check back soon or create your own.
                </p>
                <div className="text-center text-gray-500">
                  <p className="text-sm">Organizers can create tournaments to get started</p>
                </div>
              </div>
            </div>
          )}
        </div>

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