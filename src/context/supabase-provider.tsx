import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface SupabaseContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

if (typeof window !== 'undefined') {
  const hash = window.location.hash
  const search = window.location.search
  if ((hash.includes('type=invite') || hash.includes('type=recovery') || search.includes('type=invite')) && !window.location.pathname.includes('/update-password')) {
    // Preserve the hash so Supabase can process the auth token on the update-password page
    window.location.href = '/update-password' + hash
  }
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      
      // When a user clicks an invite link or forgot password link,
      // Supabase fires the PASSWORD_RECOVERY event.
      if (event === 'PASSWORD_RECOVERY') {
        window.location.href = '/update-password'
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <SupabaseContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signOut,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}

