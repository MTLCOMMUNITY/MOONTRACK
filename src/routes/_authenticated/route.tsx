import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw redirect({ to: '/sign-in' })
      }
    } catch (err) {
      // Re-throw TanStack Router redirects — they must propagate
      if (isRedirect(err)) throw err

      // For any other error (network, Supabase down, etc.)
      // redirect to sign-in rather than showing a 500
      // eslint-disable-next-line no-console
      console.error('[MoonTrack] Session check failed:', err)
      throw redirect({ to: '/sign-in' })
    }
  },
  component: AuthenticatedLayout,
})
