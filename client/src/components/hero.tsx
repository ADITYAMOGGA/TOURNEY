import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, Users, DollarSign, Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-bg leading-tight">
              Organize & Join
              <span className="bg-gradient-to-r from-primary-orange to-secondary-orange bg-clip-text text-transparent">
                {" "}Gaming{" "}
              </span>
              Tournaments
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              The ultimate platform for gaming tournament organizers and players. Create tournaments, join competitions, and climb the leaderboards.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/tournaments">
                <Button className="gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" data-testid="button-browse-tournaments">
                  <Trophy className="w-5 h-5 mr-2" />
                  Browse Tournaments
                </Button>
              </Link>
              <Link href="/create-tournament">
                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-primary-orange hover:text-primary-orange transition-all duration-300" data-testid="button-organize-tournament">
                  <Plus className="w-5 h-5 mr-2" />
                  Organize Tournament
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="text-3xl font-bold text-dark-bg" data-testid="text-active-tournaments">247</div>
                <div className="text-sm text-gray-500 mt-1">Active Tournaments</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-dark-bg" data-testid="text-total-players">15.2K</div>
                <div className="text-sm text-gray-500 mt-1">Players Registered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-dark-bg" data-testid="text-prize-pools">₹2.1M</div>
                <div className="text-sm text-gray-500 mt-1">Total Prize Pools</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="gradient-dark rounded-2xl p-8 shadow-2xl">
              <div className="gradient-primary rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="text-lg font-semibold">Featured Tournament</h3>
                    <p className="text-sm opacity-90">Gaming Championship</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">₹50,000</div>
                    <div className="text-sm opacity-90">Prize Pool</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Registration</span>
                  <span className="text-green-400 font-semibold">Open</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Players Joined</span>
                  <span className="font-semibold">1,247 / 2,000</span>
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
