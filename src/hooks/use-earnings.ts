import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Payment = {
  id: string
  amount: number
  commission_earned: number
  payment_date: string
  status: 'confirmed' | 'pending' | 'reversed'
  transaction_ref: string | null
  conversions: {
    student_name: string
    student_email: string
  } | null
}

export type EarningsSummary = {
  totalEarned: number
  totalPaidOut: number
  pendingBalance: number
}

export function useEarnings() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [totalPaidOut, setTotalPaidOut] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  async function fetchPayments() {
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

    const [paymentsResponse, payoutsResponse] = await Promise.all([
      supabase
        .from('payments')
        .select(
          `
          id,
          amount,
          commission_earned,
          payment_date,
          status,
          transaction_ref,
          conversions (
            student_name,
            student_email
          )
        `
        )
        .eq('influencer_id', influencer.id)
        .order('payment_date', { ascending: false }),
      supabase
        .from('payouts')
        .select('amount, status')
        .eq('influencer_id', influencer.id)
    ])

    if (paymentsResponse.error) {
      setError(paymentsResponse.error.message)
    } else {
      setPayments((paymentsResponse.data as unknown as Payment[]) ?? [])
    }
    
    if (!payoutsResponse.error && payoutsResponse.data) {
      const paid = payoutsResponse.data
        .filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount ?? 0), 0)
      setTotalPaidOut(paid)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()

    // Wrap the channel setup in an async IIFE to wait for auth
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
        .channel('earnings-realtime')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'payments', filter: `influencer_id=eq.${influencer.id}` },
          () => fetchPayments()
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'payments', filter: `influencer_id=eq.${influencer.id}` },
          () => fetchPayments()
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'payments' },
          () => fetchPayments()
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'payouts', filter: `influencer_id=eq.${influencer.id}` },
          () => fetchPayments()
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'payouts', filter: `influencer_id=eq.${influencer.id}` },
          () => fetchPayments()
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'payouts' },
          () => fetchPayments()
        )
        .subscribe((status) => {
          setIsLive(status === 'SUBSCRIBED')
        })
    })()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const summary: EarningsSummary = payments.reduce(
    (acc, p) => {
      acc.totalEarned += p.commission_earned ?? 0
      if (p.status === 'pending') {
        acc.pendingBalance += p.commission_earned ?? 0
      }
      return acc
    },
    { totalEarned: 0, totalPaidOut, pendingBalance: 0 }
  )

  return { payments, summary, loading, error, isLive }
}
