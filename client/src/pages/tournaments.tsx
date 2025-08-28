import { useQuery } from "@tanstack/react-query";
import { Tournament } from "@shared/schema";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import TournamentCard from "@/components/tournament-card";
import { TournamentCardSkeleton } from "@/components/tournament-card-skeleton";
import { NoTournaments } from "@/components/empty-states";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trophy, Users, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function Tournaments() {
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors">
      <Nav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { label: "Tournaments", current: true }
          ]}
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-dark-bg dark:text-white mb-4">
              All Tournaments
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join ongoing tournaments or browse upcoming events
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-4">
            <Link href="/create-tournament">
              <Button className="gradient-primary text-white hover:shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            </Link>
          </div>
        </div>

        {/* Tournament Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-primary-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tournaments?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Users className="h-4 w-4 text-primary-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tournaments?.reduce((sum, t) => sum + t.registeredPlayers, 0) || 0}
              </div>
              <p className="text-xs text-muted-foreground">Players registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
              <Calendar className="h-4 w-4 text-primary-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{tournaments?.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">Total rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* Tournament Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TournamentCardSkeleton key={i} />
            ))
          ) : tournaments?.length === 0 ? (
            <div className="col-span-full">
              <NoTournaments />
            </div>
          ) : (
            tournaments?.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
