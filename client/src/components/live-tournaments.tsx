import { useQuery } from "@tanstack/react-query";
import { Tournament } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TournamentCard from "./tournament-card";

export default function LiveTournaments() {
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-bg mb-4">
              Live Tournaments
            </h2>
            <p className="text-xl text-gray-600">
              Join ongoing tournaments or browse upcoming events
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-4">
            <Link href="/tournaments">
              <Button className="gradient-primary text-white hover:shadow-lg" data-testid="button-all-tournaments">
                All Tournaments
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-primary-orange hover:text-primary-orange" data-testid="button-my-tournaments">
              My Tournaments
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-24 bg-gray-200">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full mt-6" />
                </div>
              </div>
            ))
          ) : tournaments && tournaments.length > 0 ? (
            tournaments.slice(0, 3).map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tournaments available</h3>
              <p className="text-gray-600 mb-6">Be the first to create a tournament for the Free Fire community.</p>
              <Link href="/create-tournament">
                <Button className="gradient-primary text-white">
                  Create Tournament
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {tournaments && tournaments.length > 3 && (
          <div className="text-center mt-12">
            <Link href="/tournaments">
              <Button className="gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300" data-testid="button-view-all">
                View All Tournaments
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
