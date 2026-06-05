import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Payout = {
  id: string
  amount: number
  payout_date: string
  method: string
  reference: string | null
  status: 'paid' | 'pending' | 'failed'
  note: string | null
}

export function usePayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  async function fetchPayouts() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError('Not authenticated')
      setLoading(false)
      return
    }

    const { data: influencer } = await supabase
      .from('influencers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!influencer) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('payouts')
      .select('id, amount, payout_date, method, reference, status, note')
      .eq('influencer_id', influencer.id)
      .order('payout_date', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setPayouts((data as Payout[]) ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPayouts()

    let channel: ReturnType<typeof supabase.channel> | null = null

    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: influencer } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!influencer) return

      channel = supabase
        .channel('payouts-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'payouts',
            filter: `influencer_id=eq.${influencer.id}`,
          },
          () => fetchPayouts()
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'payouts',
            filter: `influencer_id=eq.${influencer.id}`,
          },
          () => fetchPayouts()
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'payouts' },
          () => fetchPayouts()
        )
        .subscribe((status) => {
          setIsLive(status === 'SUBSCRIBED')
        })
    })()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const totalPaid = payouts
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPending = payouts
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  return { payouts, loading, error, isLive, totalPaid, totalPending }
}
