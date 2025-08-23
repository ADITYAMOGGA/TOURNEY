import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Nav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/tournaments", label: "Browse Tournaments" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#leaderboards", label: "Leaderboards" },
    { href: "#support", label: "Support" },
  ];

  const isActive = (href: string) => {
    return location === href;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div>
                <h1 className="text-2xl font-bold text-dark-bg" data-testid="text-logo">TOURNEY</h1>
                <span className="text-xs text-gray-500 -mt-1 block">Free Fire Tournaments</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary-orange"
                        : "text-gray-600 hover:text-primary-orange"
                    }`}
                    data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-primary-orange"
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
            <Button className="gradient-primary text-white hover:shadow-lg" data-testid="button-get-started">
              Get Started
            </Button>
          </div>
          
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={`block px-3 py-2 text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-primary-orange"
                            : "text-gray-600 hover:text-primary-orange"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ))}
                  <div className="pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-gray-600">
                      Sign In
                    </Button>
                    <Button className="w-full gradient-primary text-white">
                      Get Started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
