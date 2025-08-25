import { createClient } from '@supabase/supabase-js'

// In Replit, we get the environment variables from the server-side via a global window object
// or directly from the environment in development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
  (typeof window !== 'undefined' && (window as any).__SUPABASE_URL__) ||
  'https://qfvyubwlzcgcxeyjbzfn.supabase.co'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof window !== 'undefined' && (window as any).__SUPABASE_ANON_KEY__) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdnl1YndsemNnY3hleWpiemZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4ODIxNzEsImV4cCI6MjA3MTQ1ODE3MX0.Xydm7CSc5pp3MpgkopYEtw9QqNm7RGPZCjJ7QfPodr4'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)