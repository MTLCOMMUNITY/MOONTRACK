import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

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

// 30 minutes in ms
const IDLE_TIMEOUT_MS = 30 * 60 * 1000
const WARNING_MS = 1 * 60 * 1000 // 1 min before logout

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    window.location.href = '/sign-in'
  }, [])

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

  // Idle Timeout Logic
  useEffect(() => {
    if (!session) return

    let timeoutId: NodeJS.Timeout
    let warningId: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeoutId)
      clearTimeout(warningId)

      warningId = setTimeout(() => {
        toast.warning('Your session will expire in 1 minute due to inactivity.')
      }, IDLE_TIMEOUT_MS - WARNING_MS)

      timeoutId = setTimeout(() => {
        toast.error('Session expired due to inactivity.')
        signOut()
      }, IDLE_TIMEOUT_MS)
    }

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll']
    const handleActivity = () => {
      // Throttle resets to avoid excessive timer recreation
      requestAnimationFrame(resetTimer)
    }

    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }))
    resetTimer()

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity))
      clearTimeout(timeoutId)
      clearTimeout(warningId)
    }
  }, [session, signOut])

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

