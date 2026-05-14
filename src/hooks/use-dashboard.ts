import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type DashboardStats = {
  totalClicks: number
  totalConversions: number
  commissionEarned: number
  pendingBalance: number
}

export type RecentConversion = {
  id: string
  student_name: string
  registered_at: string
  payment_status: string
  commission_earned: number | null
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClicks: 0,
    totalConversions: 0,
    commissionEarned: 0,
    pendingBalance: 0,
  })
  const [recentConversions, setRecentConversions] = useState<
    RecentConversion[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Total clicks — sum of all referral_links.click_count
        const { data: linkData } = await supabase
          .from('referral_links')
          .select('click_count')

        const totalClicks =
          linkData?.reduce((sum, l) => sum + (l.click_count ?? 0), 0) ?? 0

        // Total conversions count
        const { count: convCount } = await supabase
          .from('conversions')
          .select('id', { count: 'exact', head: true })

        // Commission earned (all confirmed payments)
        const { data: payData } = await supabase
          .from('payments')
          .select('commission_earned, status')

        const commissionEarned =
          payData
            ?.filter((p) => p.status === 'confirmed')
            .reduce((sum, p) => sum + (p.commission_earned ?? 0), 0) ?? 0

        const pendingBalance =
          payData
            ?.filter((p) => p.status === 'pending')
            .reduce((sum, p) => sum + (p.commission_earned ?? 0), 0) ?? 0

        // Recent 5 conversions with their payment commission
        const { data: convData, error: convError } = await supabase
          .from('conversions')
          .select(
            `id, student_name, registered_at, payment_status,
             payments ( commission_earned )`
          )
          .order('registered_at', { ascending: false })
          .limit(5)

        if (convError) setError(convError.message)

        const recent: RecentConversion[] = (convData ?? []).map((c: any) => ({
          id: c.id,
          student_name: c.student_name,
          registered_at: c.registered_at,
          payment_status: c.payment_status,
          commission_earned: c.payments?.[0]?.commission_earned ?? null,
        }))

        setStats({ totalClicks, totalConversions: convCount ?? 0, commissionEarned, pendingBalance })
        setRecentConversions(recent)
      } catch (err: any) {
        setError(err.message ?? 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  return { stats, recentConversions, loading, error }
}
