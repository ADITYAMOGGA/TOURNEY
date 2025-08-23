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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-bg mb-4">
            Welcome to TOURNEY!
          </h1>
          <p className="text-xl text-gray-600">
            Choose your role to get started with the Free Fire tournament platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary-orange" onClick={() => selectRole('organizer')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white text-2xl w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-dark-bg">Tournament Organizer</CardTitle>
              <CardDescription className="text-gray-600">
                Create, host, and manage Free Fire tournaments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Trophy className="w-5 h-5 text-primary-orange" />
                  <span>Create tournaments with custom rules</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-primary-orange" />
                  <span>Manage player registrations</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-primary-orange" />
                  <span>Monitor tournament progress</span>
                </div>
              </div>
              <Button 
                className="w-full gradient-primary text-white py-3 text-lg font-semibold hover:shadow-lg"
                onClick={() => selectRole('organizer')}
                disabled={loading}
                data-testid="button-select-organizer"
              >
                {loading ? "Setting up..." : "Become an Organizer"}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary-orange" onClick={() => selectRole('player')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="text-white text-2xl w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-dark-bg">Player</CardTitle>
              <CardDescription className="text-gray-600">
                Join tournaments and compete with other players
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <span>Browse and join tournaments</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Compete with other players</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Gamepad2 className="w-5 h-5 text-blue-500" />
                  <span>Track your tournament history</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 text-lg font-semibold hover:shadow-lg"
                onClick={() => selectRole('player')}
                disabled={loading}
                data-testid="button-select-player"
              >
                {loading ? "Setting up..." : "Join as Player"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}