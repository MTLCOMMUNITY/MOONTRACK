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

        const { data: convData, error: convError } = await supabase
          .from('conversions')
          .select(
            `id, student_name, registered_at, ref_code, payment_status,
             payments ( commission_earned )`
          )
          .eq('influencer_id', user.id)
          .order('registered_at', { ascending: false })

        if (convError) throw convError

        const reports: ReportRow[] = (convData ?? []).map((c: any) => ({
          id: c.id,
          student_name: c.student_name,
          registered_at: c.registered_at,
          ref_code: c.ref_code,
          payment_status: c.payment_status,
          commission_earned: c.payments?.[0]?.commission_earned ?? null,
        }))

        setData(reports)
      } catch (err: any) {
        setError(err.message ?? 'Failed to load reports')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  return { data, loading, error }
}
