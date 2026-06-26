import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  role: 'Admin' | 'Staff' | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: async () => {},
})

const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url_here'
)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<'Admin' | 'Staff' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initializeAuth() {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        const sessionUser = session?.user ?? null
        setUser(sessionUser)
        setRole(sessionUser?.email?.includes('admin') ? 'Admin' : 'Staff')
      } else {
        const savedSession = localStorage.getItem('erp_session')
        const savedUser = localStorage.getItem('erp_user')
        if (savedSession && savedUser) {
          setSession(JSON.parse(savedSession))
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          setRole(parsedUser?.email?.includes('admin') ? 'Admin' : 'Staff')
        }
      }
      setLoading(false)
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      setSession(_session)
      const sessionUser = _session?.user ?? null
      setUser(sessionUser)
      setRole(sessionUser?.email?.includes('admin') ? 'Admin' : 'Staff')
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('erp_session')
      localStorage.removeItem('erp_user')
      setSession(null)
      setUser(null)
      setRole(null)
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ session, user, role, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
