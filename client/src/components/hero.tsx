import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, Users, DollarSign, Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-white dark:bg-dark-bg py-20 lg:py-32 border-b-2 border-black dark:border-gray-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-bg dark:text-white leading-tight font-mono">
              ORGANIZE & JOIN
              <span className="bg-gradient-to-r from-primary-orange to-secondary-orange bg-clip-text text-transparent">
                {" "}GAMING{" "}
              </span>
              TOURNAMENTS
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-mono">
              The ultimate platform for gaming tournament organizers and players. Create tournaments, join competitions, and climb the leaderboards.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/tournaments">
                <Button className="bg-primary-orange text-white px-8 py-4 text-lg font-bold hover:bg-secondary-orange transition-all duration-200 font-mono border-2 border-primary-orange" data-testid="button-browse-tournaments">
                  <Trophy className="w-5 h-5 mr-2" />
                  BROWSE TOURNAMENTS
                </Button>
              </Link>
              <Link href="/create-tournament">
                <Button className="border-2 border-primary-orange text-primary-orange dark:text-white px-8 py-4 text-lg font-bold hover:bg-primary-orange hover:text-white transition-all duration-200 font-mono bg-white dark:bg-dark-card" data-testid="button-organize-tournament">
                  <Plus className="w-5 h-5 mr-2" />
                  ORGANIZE TOURNAMENT
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="text-3xl font-bold text-dark-bg dark:text-white" data-testid="text-active-tournaments">247</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active Tournaments</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-dark-bg dark:text-white" data-testid="text-total-players">15.2K</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Players Registered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-dark-bg dark:text-white" data-testid="text-prize-pools">₹2.1M</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Prize Pools</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-dark-card dark:bg-card border-2 border-gray-300 dark:border-gray-600 p-8 transition-colors">
              <div className="bg-primary-orange p-6 mb-6 border-2 border-black">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="text-lg font-bold font-mono">FEATURED TOURNAMENT</h3>
                    <p className="text-sm opacity-90 font-mono">GAMING CHAMPIONSHIP</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono">$50,000</div>
                    <div className="text-sm opacity-90 font-mono">PRIZE POOL</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono">REGISTRATION</span>
                  <span className="text-green-400 font-bold font-mono">OPEN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono">PLAYERS JOINED</span>
                  <span className="font-bold font-mono">1,247 / 2,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Entry Fee</span>
                  <span className="font-semibold">₹100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Starts In</span>
                  <span className="text-primary-orange font-semibold">2h 15m</span>
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-primary-orange text-white py-3 rounded-xl font-semibold hover:bg-secondary-orange transition-colors" data-testid="button-join-featured">
                Join Tournament
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
