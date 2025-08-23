import { Trophy, Users, TrendingUp, Wallet, Smartphone, Shield } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Tournament Creation",
    description: "Create and customize tournaments with flexible formats, prize pools, and registration settings.",
  },
  {
    icon: Users,
    title: "Player Management", 
    description: "Automated registration, team formation, and player verification for smooth tournament operations.",
  },
  {
    icon: TrendingUp,
    title: "Live Tracking",
    description: "Real-time tournament brackets, match results, and leaderboard updates for participants.",
  },
  {
    icon: Wallet,
    title: "Prize Distribution",
    description: "Secure and automated prize pool distribution with multiple payment gateway support.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Fully responsive design optimized for mobile gaming community and on-the-go management.",
  },
  {
    icon: Shield,
    title: "Anti-Cheat System",
    description: "Advanced monitoring and verification systems to ensure fair play in all tournaments.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-bg mb-4">
            Everything You Need for Tournaments
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional tournament management tools and seamless player experience in one platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                data-testid={`feature-card-${index}`}
              >
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6">
                  <IconComponent className="text-white text-2xl w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-dark-bg mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
