import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const footerSections = [
  {
    title: "Platform",
    links: [
      { href: "/tournaments", label: "Browse Tournaments" },
      { href: "/create-tournament", label: "Create Tournament" },
      { href: "#leaderboards", label: "Leaderboards" },
      { href: "#player-stats", label: "Player Stats" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "#help", label: "Help Center" },
      { href: "#rules", label: "Tournament Rules" },
      { href: "#contact", label: "Contact Us" },
      { href: "#report", label: "Report Issue" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#privacy", label: "Privacy Policy" },
      { href: "#terms", label: "Terms of Service" },
      { href: "#cookies", label: "Cookie Policy" },
      { href: "#fair-play", label: "Fair Play Policy" },
    ],
  },
];

const socialLinks = [
  { icon: "discord", href: "#", label: "Discord" },
  { icon: "youtube", href: "#", label: "YouTube" }, 
  { icon: "instagram", href: "#", label: "Instagram" },
  { icon: "twitter", href: "#", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/">
              <h3 className="text-2xl font-bold text-dark-bg mb-4">TOURNEY</h3>
            </Link>
            <p className="text-gray-600 mb-4">
              The ultimate Free Fire tournament platform for players and organizers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.icon}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-primary-orange"
                  data-testid={`button-social-${social.icon}`}
                >
                  <span className="sr-only">{social.label}</span>
                  {/* Using text placeholder instead of actual icons for simplicity */}
                  <span className="text-xl">{social.icon.charAt(0).toUpperCase()}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold text-dark-bg mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-600">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a 
                        className="hover:text-primary-orange transition-colors"
                        data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 TOURNEY. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm mt-4 md:mt-0">
            Made with ❤️ for the Free Fire community
          </p>
        </div>
      </div>
    </footer>
  );
}
