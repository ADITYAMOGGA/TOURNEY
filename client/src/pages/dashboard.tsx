import { useAuth } from "@/contexts/AuthContext"
import { useLocation } from "wouter"
import { useEffect } from "react"
import Nav from "@/components/nav"
import Footer from "@/components/footer"
import AdminSection from "../components/admin-section"
import PublicSection from "../components/public-section"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [, navigate] = useLocation()

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

        {user.role === 'organizer' ? (
          <div className="space-y-8">
            <AdminSection />
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-dark-bg mb-6">Browse All Tournaments</h2>
              <PublicSection />
            </div>
          </div>
        ) : (
          <PublicSection />
        )}
      </div>

      <Footer />
    </div>
  )
}