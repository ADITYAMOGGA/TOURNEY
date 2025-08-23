import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  username: string
  created_at: string
  role?: 'organizer' | 'player'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  signIn: (username: string, password: string) => Promise<{ error: any }>
  signUp: (username: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in via localStorage
    const savedUser = localStorage.getItem('tourney_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('tourney_user')
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('password', password)
        .single()

      if (error || !data) {
        return { error: { message: 'Invalid username or password' } }
      }

      setUser(data)
      localStorage.setItem('tourney_user', JSON.stringify(data))
      return { error: null }
    } catch (error) {
      return { error: { message: 'Login failed' } }
    }
  }

  const signUp = async (username: string, password: string) => {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (existingUser) {
        return { error: { message: 'Username already exists' } }
      }

      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username: username.toLowerCase(),
            password: password,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (error) {
        return { error: { message: 'Failed to create account' } }
      }

      setUser(data)
      localStorage.setItem('tourney_user', JSON.stringify(data))
      return { error: null }
    } catch (error) {
      return { error: { message: 'Signup failed' } }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('tourney_user')
  }

  const value = {
    user,
    loading,
    setUser,
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