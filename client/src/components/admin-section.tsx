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
            <div className="text-2xl font-bold">{tournaments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active tournaments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-primary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournaments?.reduce((sum, t) => sum + t.registeredPlayers, 0) || 0}</div>
            <p className="text-xs text-muted-foreground">Across all tournaments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prize Pool</CardTitle>
            <Trophy className="h-4 w-4 text-primary-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{tournaments?.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Total distributed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Get Started</CardTitle>
            <Plus className="h-4 w-4 text-primary-orange" />
          </CardHeader>
          <CardContent>
            <Link href="/create-tournament">
              <Button className="w-full gradient-primary text-white" data-testid="button-quick-create">
                <Plus className="w-4 h-4 mr-2" />
                Create Now
              </Button>
            </Link>
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
          ) : myTournaments.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <Link href="/create-tournament">
                  <div className="w-32 h-32 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-full flex items-center justify-center mx-auto mb-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                    <Plus className="w-16 h-16 text-white" />
                  </div>
                </Link>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Create Your First Tournament</h4>
                <p className="text-gray-600 mb-8 text-lg">
                  Start organizing amazing Free Fire tournaments for your community.
                </p>
                <Link href="/create-tournament">
                  <Button className="gradient-primary text-white px-8 py-3 text-lg" data-testid="button-create-first-tournament">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Tournament
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            myTournaments.map((tournament) => (
              <Card key={tournament.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-orange">
                <div className="aspect-video bg-gradient-to-r from-primary-orange to-secondary-orange rounded-t-lg relative overflow-hidden">
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
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-primary-orange transition-colors">
                      {tournament.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {tournament.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {tournament.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-primary-orange" />
                      {tournament.registeredPlayers}/{tournament.slots}
                    </span>
                    <span className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1 text-primary-orange" />
                      ₹{tournament.prizePool.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(tournament.startTime).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/tournament-details/${tournament.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}