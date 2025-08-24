import { useAuth } from "@/contexts/AuthContext"
import { useLocation } from "wouter"
import { useEffect, useState } from "react"
import Nav from "@/components/nav"
import Footer from "@/components/footer"
import AdminSection from "../components/admin-section"
import PublicSection from "../components/public-section"
import { Button } from "@/components/ui/button"
import { Trophy, Users } from "lucide-react"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [, navigate] = useLocation()
  const [activeSection, setActiveSection] = useState<'organizer' | 'public'>('public')

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    } else if (!loading && user && !user.role) {
      navigate("/role-selection")
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.role) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-bg mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-xl text-gray-600 capitalize">
            {user.role} Dashboard
          </p>
        </div>

        {/* Header Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <Button
              variant={activeSection === 'public' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('public')}
              className={`px-6 py-2 ${
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
                onClick={() => setActiveSection('organizer')}
                className={`px-6 py-2 ${
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

        {/* Content based on active section */}
        {activeSection === 'public' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark-bg mb-2">All Tournaments</h2>
              <p className="text-gray-600">Discover and join exciting Free Fire tournaments</p>
            </div>
            <PublicSection />
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark-bg mb-2">Organizer Dashboard</h2>
              <p className="text-gray-600">Create and manage your tournaments</p>
            </div>
            <AdminSection />
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}