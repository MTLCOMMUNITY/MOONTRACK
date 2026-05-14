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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  async function fetchPayments() {
    const { data, error } = await supabase
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
      .order('payment_date', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setPayments((data as unknown as Payment[]) ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()

    // Realtime subscription
    const channel = supabase
      .channel('payments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        () => {
          fetchPayments()
        }
      )
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const summary: EarningsSummary = payments.reduce(
    (acc, p) => {
      acc.totalEarned += p.commission_earned ?? 0
      if (p.status === 'confirmed') {
        acc.totalPaidOut += p.commission_earned ?? 0
      }
      if (p.status === 'pending') {
        acc.pendingBalance += p.commission_earned ?? 0
      }
      return acc
    },
    { totalEarned: 0, totalPaidOut: 0, pendingBalance: 0 }
  )

  return { payments, summary, loading, error, isLive }
}
