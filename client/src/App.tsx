import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Tournaments from "@/pages/tournaments";
import CreateTournament from "@/pages/create-tournament";
import TournamentDetails from "@/pages/tournament-details";
import Login from "@/pages/login";
import RoleSelection from "@/pages/role-selection";
import Dashboard from "@/pages/dashboard";

function AuthenticatedRouter() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      // If user is logged in and on home page, redirect to dashboard
      if (user && location === "/") {
        setLocation("/dashboard");
      }
      // If user is not logged in and trying to access protected routes, redirect to login
      if (!user && ["/dashboard", "/create-tournament"].includes(location)) {
        setLocation("/login");
      }
    }
  }, [user, loading, location, setLocation]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/create-tournament" component={CreateTournament} />
      <Route path="/tournament/:id" component={TournamentDetails} />
      <Route path="/login" component={Login} />
      <Route path="/role-selection" component={RoleSelection} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  return (
    <AuthProvider>
      <AuthenticatedRouter />
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
