import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Gamepad2, Crown } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-dark-bg dark:bg-dark-card transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Start Your Tournament Journey?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Join thousands of Free Fire players and organizers who trust TOURNEY for their competitive gaming experience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/tournaments">
            <Button className="gradient-primary text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" data-testid="button-start-playing">
              <Gamepad2 className="w-5 h-5 mr-3" />
              Start Playing Now
            </Button>
          </Link>
          <Link href="/create-tournament">
            <Button variant="outline" className="border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary-orange transition-all duration-300" data-testid="button-organize-tournament-cta">
              <Crown className="w-5 h-5 mr-3" />
              Organize Tournament
            </Button>
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-orange mb-2">24/7</div>
            <div className="text-gray-300">Tournament Support</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-orange mb-2">99.9%</div>
            <div className="text-gray-300">Platform Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-orange mb-2">0%</div>
            <div className="text-gray-300">Platform Commission</div>
          </div>
        </div>
      </div>
    </section>
  );
}
