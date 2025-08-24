import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useLocation } from "wouter"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Shield, Gamepad2 } from "lucide-react"

export default function RoleSelection() {
  const [loading, setLoading] = useState(false)
  const { user, setUser } = useAuth()
  const [, navigate] = useLocation()
  const { toast } = useToast()

  const selectRole = async (role: 'organizer' | 'player') => {
    if (!user) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: role })
        .eq('id', user.id)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to set role. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update local user state
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem('tourney_user', JSON.stringify(updatedUser))

      toast({
        title: "Role Selected!",
        description: `You are now set as a ${role}.`,
      })

      navigate("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-dark-bg mb-6">
            👉 Tell us who you are
          </h1>
          <p className="text-xl text-gray-600">
            This helps us set up your experience the right way.
          </p>
        </div>

        <div className="space-y-6">
          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary-orange p-8" 
            onClick={() => selectRole('organizer')}
          >
            <CardContent className="text-center space-y-4">
              <div className="text-6xl mb-4">🏆</div>
              <CardTitle className="text-2xl font-bold text-dark-bg">Organizer</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                I want to host and manage tournaments.
              </CardDescription>
              <Button 
                className="w-full gradient-primary text-white py-4 text-lg font-semibold hover:shadow-lg mt-6"
                onClick={() => selectRole('organizer')}
                disabled={loading}
                data-testid="button-select-organizer"
              >
                {loading ? "Setting up..." : "Choose Organizer"}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500 p-8" 
            onClick={() => selectRole('player')}
          >
            <CardContent className="text-center space-y-4">
              <div className="text-6xl mb-4">🎮</div>
              <CardTitle className="text-2xl font-bold text-dark-bg">Player</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                I want to join and play in tournaments.
              </CardDescription>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 text-lg font-semibold hover:shadow-lg mt-6"
                onClick={() => selectRole('player')}
                disabled={loading}
                data-testid="button-select-player"
              >
                {loading ? "Setting up..." : "Choose Player"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}