import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type ReportRow = {
  id: string
  student_name: string
  registered_at: string
  ref_code: string
  payment_status: string
  commission_earned: number | null
}

export function useReports() {
  const [data, setData] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReports() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: influencer } = await supabase
          .from('influencers')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!influencer) {
          setLoading(false)
          return
        }

        const { data: convData, error: convError } = await supabase
          .from('conversions')
          .select(
            `id, student_name, registered_at, ref_code, payment_status,
             payments ( commission_earned )`
          )
          .eq('influencer_id', influencer.id)
          .order('registered_at', { ascending: false })

        if (convError) throw convError

        const rawConvData = convData as unknown as (Omit<ReportRow, 'commission_earned'> & { payments: { commission_earned: number }[] | { commission_earned: number } | null })[] | null
        const reports: ReportRow[] = (rawConvData ?? []).map((c) => {
          const paymentsArray = Array.isArray(c.payments)
            ? c.payments
            : c.payments
              ? [c.payments]
              : []
          return {
            id: c.id,
            student_name: c.student_name,
            registered_at: c.registered_at,
            ref_code: c.ref_code,
            payment_status: c.payment_status,
            commission_earned: paymentsArray[0]?.commission_earned ?? null,
          }
        })

        setData(reports)
      } catch (err) {
        const error = err as Error
        setError(error.message ?? 'Failed to load reports')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  return { data, loading, error }
}
