import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type CurrentUser = {
  name: string
  email: string
  avatar: string
  isAdmin: boolean
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser>({
    name: '',
    email: '',
    avatar: '',
    isAdmin: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load(forceLoading = false) {
      if (forceLoading) {
        setLoading(true)
      }
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!isMounted) return

        if (!authUser) {
          setUser({
            name: '',
            email: '',
            avatar: '',
            isAdmin: false,
          })
          return
        }

        const email = authUser.email ?? ''

        // Check admins table first
        const { data: adminRow } = await supabase
          .from('admins')
          .select('full_name')
          .eq('user_id', authUser.id)
          .single()

        if (!isMounted) return

        if (adminRow) {
          setUser({
            name: adminRow.full_name || 'Admin',
            email,
            avatar: '',
            isAdmin: true,
          })
          return
        }

        // Otherwise treat as influencer
        const { data: influencer } = await supabase
          .from('influencers')
          .select('full_name')
          .eq('user_id', authUser.id)
          .single()

        if (!isMounted) return

        const name =
          influencer?.full_name ||
          authUser.user_metadata?.full_name ||
          email.split('@')[0]

        setUser({ name, email, avatar: '', isAdmin: false })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading current user:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load(true)

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      // Refresh user data silently in the background without forcing loading=true,
      // preventing the sidebar and page content from flashing/disappearing on tab switch/focus.
      load(false)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return { ...user, loading }
}
