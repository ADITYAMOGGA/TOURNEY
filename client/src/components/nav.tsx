import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";

export default function Nav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-primary-orange flex items-center gap-2"
                    data-testid="button-user-menu"
                  >
                    <User className="w-4 h-4" />
                    {user.username || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={signOut} data-testid="button-sign-out">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-primary-orange"
                    data-testid="button-sign-in"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="gradient-primary text-white hover:shadow-lg" data-testid="button-get-started">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
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
                    {user ? (
                      <>
                        <div className="px-3 py-2 text-sm text-gray-600">
                          Welcome, {user.username || 'User'}
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-gray-600"
                          onClick={signOut}
                          data-testid="button-mobile-sign-out"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login">
                          <Button variant="ghost" className="w-full justify-start text-gray-600">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button className="w-full gradient-primary text-white">
                            Get Started
                          </Button>
                        </Link>
                      </>
                    )}
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
