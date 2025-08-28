import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import garenaLogo from "@assets/garena_1756025529823.png";

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
    <footer className="bg-white dark:bg-dark-bg border-t-2 border-black dark:border-gray-600 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/">
              <div className="flex items-center gap-2 mb-4">
                <img src={garenaLogo} alt="Garena" className="h-6 w-auto" />
                <h3 className="text-2xl font-bold text-dark-bg dark:text-white">GARENA x TOURNEY</h3>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The ultimate Free Fire tournament platform for players and organizers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.icon}
                  className="text-gray-400 hover:text-primary-orange dark:hover:text-primary-orange bg-transparent border-none p-2 transition-colors duration-200"
                  data-testid={`button-social-${social.icon}`}
                >
                  <span className="sr-only">{social.label}</span>
                  {/* Using text placeholder instead of actual icons for simplicity */}
                  <span className="text-xl font-mono">{social.icon.charAt(0).toUpperCase()}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold text-dark-bg dark:text-white mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span 
                        className="hover:text-primary-orange transition-colors cursor-pointer"
                        data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © 2024 GARENA x TOURNEY. All rights reserved.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-4 md:mt-0">
            Powering the future of competitive esports
          </p>
        </div>
      </div>
    </footer>
  );
}
