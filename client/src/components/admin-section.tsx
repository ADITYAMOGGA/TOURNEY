import { Link } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { Tournament } from "@shared/schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Users, Settings, Calendar, Edit } from "lucide-react"

export default function AdminSection() {
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  })

  const myTournaments = tournaments?.slice(0, 3) || [] // Mock - would filter by organizer in real app

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-orange to-secondary-orange rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Tournament Organizer Panel</h2>
        <p className="text-lg opacity-90 mb-6">
          Create, manage, and host Free Fire tournaments for the community
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/create-tournament">
            <Button className="bg-white text-primary-orange hover:bg-gray-100 font-semibold" data-testid="button-create-tournament">
              <Plus className="w-5 h-5 mr-2" />
              Create New Tournament
            </Button>
          </Link>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-orange" data-testid="button-tournament-settings">
            <Settings className="w-5 h-5 mr-2" />
            Tournament Settings
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-primary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active tournaments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-primary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Across all tournaments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prize Pool</CardTitle>
            <Trophy className="h-4 w-4 text-primary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹85,000</div>
            <p className="text-xs text-muted-foreground">Total distributed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Event</CardTitle>
            <Calendar className="h-4 w-4 text-primary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h 15m</div>
            <p className="text-xs text-muted-foreground">Time until start</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-dark-bg">My Tournaments</h3>
          <Link href="/tournaments">
            <Button variant="outline" data-testid="button-view-all-my-tournaments">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : myTournaments.length > 0 ? (
            myTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{tournament.name}</CardTitle>
                      <CardDescription className="capitalize">{tournament.type} Tournament</CardDescription>
                    </div>
                    <Badge className={
                      tournament.status === 'open' ? 'bg-green-100 text-green-800' :
                      tournament.status === 'starting' ? 'bg-yellow-100 text-yellow-800' :
                      tournament.status === 'live' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {tournament.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Players:</span>
                      <span>{tournament.registeredPlayers}/{tournament.maxPlayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prize Pool:</span>
                      <span>₹{tournament.prizePool.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/tournament/${tournament.id}`}>
                      <Button size="sm" variant="outline" className="flex-1" data-testid={`button-view-tournament-${tournament.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No tournaments yet</h4>
              <p className="text-gray-600 mb-6">Create your first tournament to get started.</p>
              <Link href="/create-tournament">
                <Button className="gradient-primary text-white" data-testid="button-create-first-tournament">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Tournament
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}