import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Trophy, Users } from "lucide-react";
import garenaLogo from "@assets/garena_1756025529823.png";

interface NavProps {
  activeSection?: 'organizer' | 'public'
  setActiveSection?: (section: 'organizer' | 'public') => void
}

export default function Nav({ activeSection = 'public', setActiveSection }: NavProps = {}) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <img src={garenaLogo} alt="Garena" className="h-8 w-auto" />
                <div>
                  <h1 className="text-2xl font-bold text-dark-bg" data-testid="text-logo">GARENA x TOURNEY</h1>
                  <span className="text-xs text-gray-500 -mt-1 block">Free Fire Tournaments</span>
                </div>
              </div>
            </Link>
          </div>
          
          {user && user.role && location === '/dashboard' && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={activeSection === 'public' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection?.('public')}
                  className={`px-4 py-2 text-sm ${
                    activeSection === 'public'
                      ? 'bg-white text-primary-orange shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  data-testid="button-public-section"
                >
                  <Users className="w-4 h-4 mr-2" />
                  PUBLIC
                </Button>
                {user.role === 'organizer' && (
                  <Button
                    variant={activeSection === 'organizer' ? 'default' : 'ghost'}
                    onClick={() => setActiveSection?.('organizer')}
                    className={`px-4 py-2 text-sm ${
                      activeSection === 'organizer'
                        ? 'bg-white text-primary-orange shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    data-testid="button-organizer-section"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    ORGANIZER
                  </Button>
                )}
              </div>
            </div>
          )}
          
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
                  {user && user.role && location === '/dashboard' && (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm font-medium text-gray-900">Sections</div>
                      <Button
                        variant={activeSection === 'public' ? 'default' : 'ghost'}
                        onClick={() => { setActiveSection?.('public'); setIsOpen(false); }}
                        className="w-full justify-start"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        PUBLIC
                      </Button>
                      {user.role === 'organizer' && (
                        <Button
                          variant={activeSection === 'organizer' ? 'default' : 'ghost'}
                          onClick={() => { setActiveSection?.('organizer'); setIsOpen(false); }}
                          className="w-full justify-start"
                        >
                          <Trophy className="w-4 h-4 mr-2" />
                          ORGANIZER
                        </Button>
                      )}
                    </div>
                  )}
                  
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
