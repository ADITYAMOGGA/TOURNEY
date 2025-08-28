import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Trophy, Users, LayoutDashboard, Settings, Search } from "lucide-react";
import garenaLogo from "@assets/garena_1756025529823.png";
import tourneyLogo from "@assets/image_1756054912806.png";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavProps {
  activeSection?: 'organizer' | 'public'
  setActiveSection?: (section: 'organizer' | 'public') => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
}

export default function Nav({ activeSection = 'public', setActiveSection, searchQuery = '', setSearchQuery }: NavProps = {}) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white dark:bg-dark-bg border-b-2 border-dark-bg dark:border-gray-600 sticky top-0 z-50 backdrop-blur-sm transition-colors">
      <div className="max-w-full mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <img src={garenaLogo} alt="Garena" className="h-8 w-auto" />
                <span className="text-sm font-normal text-dark-bg dark:text-white">X</span>
                <img src={tourneyLogo} alt="Tourney" className="h-10 w-auto" />
              </div>
            </Link>
          </div>
          
          {user && user.role && location === '/dashboard' && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-0 bg-secondary border border-border">
                <Button
                  variant={activeSection === 'public' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection?.('public')}
                  className={`px-6 py-3 text-sm font-medium border-r border-border ${
                    activeSection === 'public'
                      ? 'bg-dark-bg text-white dark:bg-white dark:text-dark-bg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
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
                    className={`px-6 py-3 text-sm font-medium ${
                      activeSection === 'organizer'
                        ? 'bg-dark-bg text-white dark:bg-white dark:text-dark-bg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
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
          
          {/* Search bar - show on homepage and dashboard public section */}
          {(location === '/' || (location === '/dashboard' && activeSection === 'public')) && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  className="pl-10 py-2 border-2 border-gray-300 focus:border-primary-orange rounded-lg"
                  data-testid="input-search-tournaments-header"
                />
              </div>
            </div>
          )}
          
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-2 font-medium transition-colors duration-200 bg-transparent border-none"
                    data-testid="button-user-menu"
                  >
                    <User className="w-4 h-4" />
                    {user.username || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center" data-testid="button-dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center" data-testid="button-tournaments">
                      <Trophy className="w-4 h-4 mr-2" />
                      Tournaments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center" data-testid="button-settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/statistics" className="flex items-center" data-testid="button-statistics">
                      <Trophy className="w-4 h-4 mr-2" />
                      Statistics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors duration-200 bg-transparent border-none"
                    data-testid="button-sign-in"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-primary-orange text-white hover:bg-secondary-orange dark:bg-primary-orange dark:hover:bg-secondary-orange px-6 py-2 font-medium transition-all duration-200" data-testid="button-get-started">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 bg-transparent border-none p-2" data-testid="button-mobile-menu">
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
                        <Link href="/profile">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-gray-600"
                            onClick={() => setIsOpen(false)}
                            data-testid="button-mobile-dashboard"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link href="/dashboard">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-gray-600"
                            onClick={() => setIsOpen(false)}
                            data-testid="button-mobile-tournaments"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Tournaments
                          </Button>
                        </Link>
                        <Link href="/settings">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-gray-600"
                            onClick={() => setIsOpen(false)}
                            data-testid="button-mobile-settings"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </Link>
                        <Link href="/statistics">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-gray-600"
                            onClick={() => setIsOpen(false)}
                            data-testid="button-mobile-statistics"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Statistics
                          </Button>
                        </Link>
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
