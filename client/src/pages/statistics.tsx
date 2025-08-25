import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Tournament } from "@shared/schema";
import Nav from "@/components/nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, TrendingUp, Target, Award, Zap, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Statistics() {
  const { user } = useAuth();
  const { data: tournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  // Mock user statistics - in real app, fetch from API
  const userStats = {
    tournamentsJoined: 15,
    tournamentsWon: 3,
    totalEarnings: 2500,
    winRate: 20,
    averageRank: 8,
    hoursPlayed: 127,
    favoriteMode: 'Clash Squad',
    currentStreak: 5,
    bestRank: 2,
    totalKills: 342
  };

  const platformStats = {
    totalTournaments: tournaments?.length || 0,
    liveTournaments: tournaments?.filter(t => t.status === 'live').length || 0,
    openTournaments: tournaments?.filter(t => t.status === 'open').length || 0,
    totalPlayers: tournaments?.reduce((sum, t) => sum + t.registeredPlayers, 0) || 0,
    totalPrizePools: tournaments?.reduce((sum, t) => sum + t.prizePool, 0) || 0,
    avgPrizePool: tournaments?.length ? Math.round((tournaments.reduce((sum, t) => sum + t.prizePool, 0) / tournaments.length)) : 0
  };

  const StatCard = ({ title, value, description, icon: Icon, color = "text-primary-orange" }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-2 border-black hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark-bg font-mono mb-4">STATISTICS</h1>
          <p className="text-lg text-gray-600">Track your performance and platform insights</p>
        </div>

        {/* User Personal Stats */}
        {user && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono">YOUR PERFORMANCE</h2>
                <p className="text-gray-600">Personal gaming statistics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Tournaments Joined"
                value={userStats.tournamentsJoined}
                description="Total competitions entered"
                icon={Trophy}
              />
              <StatCard
                title="Tournaments Won"
                value={userStats.tournamentsWon}
                description="Victory count"
                icon={Award}
                color="text-green-500"
              />
              <StatCard
                title="Win Rate"
                value={`${userStats.winRate}%`}
                description="Success percentage"
                icon={Target}
                color="text-blue-500"
              />
              <StatCard
                title="Total Earnings"
                value={`$${userStats.totalEarnings.toLocaleString()}`}
                description="Prize money won"
                icon={DollarSign}
                color="text-yellow-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Average Rank"
                value={`#${userStats.averageRank}`}
                description="Typical finishing position"
                icon={TrendingUp}
              />
              <StatCard
                title="Best Rank"
                value={`#${userStats.bestRank}`}
                description="Highest finish achieved"
                icon={Trophy}
                color="text-gold"
              />
              <StatCard
                title="Current Streak"
                value={userStats.currentStreak}
                description="Consecutive top 10 finishes"
                icon={Zap}
                color="text-purple-500"
              />
            </div>
          </section>
        )}

        {/* Platform Statistics */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-orange flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-mono">PLATFORM INSIGHTS</h2>
              <p className="text-gray-600">Tournament ecosystem overview</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Tournaments"
              value={platformStats.totalTournaments}
              description="Available competitions"
              icon={Calendar}
            />
            <StatCard
              title="Live Tournaments"
              value={platformStats.liveTournaments}
              description="Currently running"
              icon={Zap}
              color="text-red-500"
            />
            <StatCard
              title="Open Registration"
              value={platformStats.openTournaments}
              description="Available to join"
              icon={Users}
              color="text-green-500"
            />
            <StatCard
              title="Total Players"
              value={platformStats.totalPlayers.toLocaleString()}
              description="Registered participants"
              icon={Users}
            />
            <StatCard
              title="Total Prize Pools"
              value={`$${platformStats.totalPrizePools.toLocaleString()}`}
              description="Combined rewards"
              icon={DollarSign}
              color="text-yellow-500"
            />
            <StatCard
              title="Average Prize"
              value={`$${platformStats.avgPrizePool.toLocaleString()}`}
              description="Per tournament"
              icon={Trophy}
              color="text-blue-500"
            />
          </div>
        </section>

        {/* Game Mode Performance */}
        {user && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono">GAME MODE BREAKDOWN</h2>
                <p className="text-gray-600">Performance by tournament type</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="font-mono">FAVORITE MODE</CardTitle>
                  <CardDescription>Most played tournament type</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="text-4xl font-bold text-primary-orange font-mono mb-2">
                    {userStats.favoriteMode}
                  </div>
                  <p className="text-gray-600">67% of tournaments played</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-black">
                <CardHeader>
                  <CardTitle className="font-mono">TOTAL ELIMINATIONS</CardTitle>
                  <CardDescription>Across all tournaments</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="text-4xl font-bold text-red-500 font-mono mb-2">
                    {userStats.totalKills}
                  </div>
                  <p className="text-gray-600">Average {Math.round(userStats.totalKills / userStats.tournamentsJoined)} per tournament</p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}