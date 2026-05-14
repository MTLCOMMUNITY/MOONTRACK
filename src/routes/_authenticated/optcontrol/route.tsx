import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/_authenticated/optcontrol')({
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw redirect({ to: '/sign-in' })

    // Check the dedicated admins table — not influencers
    const { data: adminRow } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!adminRow) {
      // Not an admin — redirect silently to dashboard
      throw redirect({ to: '/dashboard' })
    }
  },
  component: () => <Outlet />,
})
