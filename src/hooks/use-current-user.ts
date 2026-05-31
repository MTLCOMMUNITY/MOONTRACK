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
    async function load() {
      setLoading(true)
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        setLoading(false)
        return
      }

      const email = authUser.email ?? ''

      // Check admins table first
      const { data: adminRow } = await supabase
        .from('admins')
        .select('full_name')
        .eq('user_id', authUser.id)
        .single()

      if (adminRow) {
        setUser({
          name: adminRow.full_name || 'Admin',
          email,
          avatar: '',
          isAdmin: true,
        })
        setLoading(false)
        return
      }

      // Otherwise treat as influencer
      const { data: influencer } = await supabase
        .from('influencers')
        .select('full_name')
        .eq('user_id', authUser.id)
        .single()

      const name =
        influencer?.full_name ||
        authUser.user_metadata?.full_name ||
        email.split('@')[0]

      setUser({ name, email, avatar: '', isAdmin: false })
      setLoading(false)
    }

    load()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      load()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { ...user, loading }
}
