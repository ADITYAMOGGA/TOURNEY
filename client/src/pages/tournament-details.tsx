import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Tournament, TournamentRegistration } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import TournamentRegistrationForm from "@/components/tournament-registration-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Users, DollarSign, Clock, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function TournamentDetails() {
  const [match, params] = useRoute("/tournament/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const { data: tournament, isLoading: tournamentLoading, error: tournamentError } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", params?.id],
    enabled: !!params?.id,
  });

  const { data: registrations, isLoading: registrationsLoading, error: registrationsError } = useQuery<TournamentRegistration[]>({
    queryKey: ["/api/tournaments", params?.id, "registrations"],
    enabled: !!params?.id,
  });

  const handleRegistrationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/tournaments", params?.id] });
    queryClient.invalidateQueries({ queryKey: ["/api/tournaments", params?.id, "registrations"] });
    setRegistrationOpen(false);
  };

  if (!match || !params?.id) {
    return <div>Tournament not found</div>;
  }

  if (tournamentLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-8 space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tournamentError) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error Loading Tournament</h1>
            <p className="text-gray-600 mt-2">
              {tournamentError instanceof Error ? tournamentError.message : "Failed to load tournament details"}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Tournament not found</h1>
            <p className="text-gray-600 mt-2">The tournament you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "Registration Open", variant: "default" as const, className: "bg-green-100 text-green-800" },
      starting: { label: "Starting Soon", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      live: { label: "Live", variant: "destructive" as const, className: "bg-red-100 text-red-800" },
      completed: { label: "Completed", variant: "outline" as const, className: "bg-gray-100 text-gray-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const timeUntilStart = tournament?.startTime ? new Date(tournament.startTime).getTime() - Date.now() : 0;
  const hoursUntilStart = Math.max(0, Math.floor(timeUntilStart / (1000 * 60 * 60)));
  const minutesUntilStart = Math.max(0, Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark-bg mb-2" data-testid="text-tournament-name">
                {tournament.name}
              </h1>
              <div className="flex items-center gap-4">
                {getStatusBadge(tournament.status)}
                <span className="text-gray-600">{tournament.format}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-orange" data-testid="text-prize-pool">
                ₹{tournament.prizePool.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Prize Pool</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle>Tournament Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {tournament.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600" data-testid="text-tournament-description">
                      {tournament.description}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary-orange" />
                    <div>
                      <div className="font-medium">Players</div>
                      <div className="text-sm text-gray-600" data-testid="text-player-count">
                        {tournament.registeredPlayers} / {tournament.slots}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary-orange" />
                    <div>
                      <div className="font-medium">Entry Fee</div>
                      <div className="text-sm text-gray-600" data-testid="text-entry-fee">
                        ₹{tournament.slotPrice}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-orange" />
                    <div>
                      <div className="font-medium">Start Time</div>
                      <div className="text-sm text-gray-600" data-testid="text-start-time">
                        {tournament.startTime ? format(new Date(tournament.startTime), "PPp") : "TBD"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-orange" />
                    <div>
                      <div className="font-medium">Registration Deadline</div>
                      <div className="text-sm text-gray-600" data-testid="text-registration-deadline">
                        {tournament.registrationDeadline ? format(new Date(tournament.registrationDeadline), "PPp") : "TBD"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {registrations && registrations.length > 0 && (
              <Card className="mt-8 border-2 border-black">
                <CardHeader>
                  <CardTitle>Registered Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registrations.map((registration, index) => (
                      <div key={registration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <div className="font-medium text-lg" data-testid={`text-team-name-${index}`}>
                            {registration.teamName || `Team ${index + 1}`}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {registration.iglRealName && registration.iglIngameId ? (
                              <div>IGL: {registration.iglRealName} ({registration.iglIngameId})</div>
                            ) : (
                              <div>Team registration</div>
                            )}
                            <div>Registered {format(new Date(registration.registeredAt), "PPp")}</div>
                          </div>
                          {registration.paymentStatus && (
                            <Badge 
                              variant={registration.paymentStatus === 'completed' ? 'default' : 'secondary'} 
                              className={`mt-2 ${registration.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                            >
                              Payment {registration.paymentStatus}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-lg px-3 py-1">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-24 border-2 border-black">
              <CardHeader>
                <CardTitle>Join Tournament</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tournament.status === "open" && (
                  <>
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-primary-orange" data-testid="text-time-remaining">
                        {hoursUntilStart}h {minutesUntilStart}m
                      </div>
                      <div className="text-sm text-gray-500">Time until start</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Entry Fee</span>
                        <span className="font-medium">₹{tournament.slotPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available Slots</span>
                        <span className="font-medium">
                          {tournament.slots - tournament.registeredPlayers}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tournament Type</span>
                        <span className="font-medium capitalize">{tournament.type}</span>
                      </div>
                    </div>

                    <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full gradient-primary text-white hover:shadow-lg"
                          disabled={tournament.registeredPlayers >= tournament.slots}
                          data-testid="button-join-tournament"
                        >
                          Join Tournament
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg bg-transparent border-none shadow-none">
                        <TournamentRegistrationForm 
                          tournament={tournament} 
                          onSuccess={handleRegistrationSuccess}
                        />
                      </DialogContent>
                    </Dialog>

                    {tournament.registeredPlayers >= tournament.slots && (
                      <div className="text-center text-sm text-red-600 font-medium">
                        Tournament is full
                      </div>
                    )}
                  </>
                )}

                {tournament.status === "starting" && (
                  <div className="text-center">
                    <Badge className="bg-yellow-100 text-yellow-800 mb-4">Starting Soon</Badge>
                    <p className="text-sm text-gray-600">
                      Registration is closed. Tournament will begin shortly.
                    </p>
                  </div>
                )}

                {tournament.status === "live" && (
                  <div className="text-center">
                    <Badge className="bg-red-100 text-red-800 mb-4">Live</Badge>
                    <p className="text-sm text-gray-600">
                      Tournament is currently in progress.
                    </p>
                  </div>
                )}

                {tournament.status === "completed" && (
                  <div className="text-center">
                    <Badge className="bg-gray-100 text-gray-800 mb-4">Completed</Badge>
                    <p className="text-sm text-gray-600">
                      This tournament has ended.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
