import { useAuth } from "@/contexts/AuthContext"
import { useLocation } from "wouter"
import { useEffect, useState } from "react"
import Nav from "@/components/nav"
import Footer from "@/components/footer"
import AdminSection from "../components/admin-section"
import PublicSection from "../components/public-section"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [, navigate] = useLocation()
  const [activeSection, setActiveSection] = useState<'organizer' | 'public'>('public')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login")
      } else if (user && !user.role) {
        navigate("/role-selection")
      }
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
      <Nav 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="py-8">
        {/* Content based on active section */}
        {activeSection === 'public' ? (
          <div>
            <PublicSection searchQuery={searchQuery} />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdminSection />
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}