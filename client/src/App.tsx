import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "@/components/animated-page";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Tournaments from "@/pages/tournaments";
import CreateTournament from "@/pages/create-tournament";
import TournamentDetails from "@/pages/tournament-details";
import Login from "@/pages/login";
import RoleSelection from "@/pages/role-selection";
import Dashboard from "@/pages/dashboard";
import Settings from "@/pages/settings";

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
    <AnimatePresence mode="wait" initial={false}>
      <Switch key={location}>
        <Route path="/">
          <AnimatedPage><Home /></AnimatedPage>
        </Route>
        <Route path="/tournaments">
          <AnimatedPage><Tournaments /></AnimatedPage>
        </Route>
        <Route path="/create-tournament">
          <AnimatedPage><CreateTournament /></AnimatedPage>
        </Route>
        <Route path="/tournament/:id">
          <AnimatedPage><TournamentDetails /></AnimatedPage>
        </Route>
        <Route path="/login">
          <AnimatedPage><Login /></AnimatedPage>
        </Route>
        <Route path="/role-selection">
          <AnimatedPage><RoleSelection /></AnimatedPage>
        </Route>
        <Route path="/dashboard">
          <AnimatedPage><Dashboard /></AnimatedPage>
        </Route>
        <Route path="/settings">
          <AnimatedPage><Settings /></AnimatedPage>
        </Route>
        <Route>
          <AnimatedPage><NotFound /></AnimatedPage>
        </Route>
      </Switch>
    </AnimatePresence>
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
