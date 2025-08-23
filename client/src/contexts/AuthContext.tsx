import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<{ error: any }>
  signUp: (username: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (username: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: `${username.toLowerCase()}@tourney.local`, // Convert username to email format
      password,
    })
    return { error }
  }

  const signUp = async (username: string, password: string) => {
    // Check if username already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('username')
      .eq('username', username.toLowerCase())
    
    if (existingUsers && existingUsers.length > 0) {
      return { error: { message: 'Username already exists' } }
    }

    const { error } = await supabase.auth.signUp({
      email: `${username.toLowerCase()}@tourney.local`, // Convert username to email format
      password,
      options: {
        data: {
          username: username.toLowerCase(),
        },
        emailRedirectTo: undefined // Disable email confirmation
      }
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}