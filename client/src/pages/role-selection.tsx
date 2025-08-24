import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useLocation } from "wouter"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

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

      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        navigate("/dashboard")
      }, 100)
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            👉 Tell us who you are
          </h1>
          <p className="text-gray-600">
            This helps us set up your experience the right way.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => selectRole('organizer')}
            disabled={loading}
            className="w-full p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-center"
            data-testid="button-select-organizer"
          >
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-xl font-semibold text-gray-900 mb-1">Organizer</div>
            <div className="text-gray-600">I want to host and manage tournaments.</div>
          </button>

          <button
            onClick={() => selectRole('player')}
            disabled={loading}
            className="w-full p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            data-testid="button-select-player"
          >
            <div className="text-4xl mb-2">🎮</div>
            <div className="text-xl font-semibold text-gray-900 mb-1">Player</div>
            <div className="text-gray-600">I want to join and play in tournaments.</div>
          </button>
        </div>

        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <p className="text-gray-600 mt-2">Setting up your account...</p>
          </div>
        )}
      </div>
    </div>
  )
}