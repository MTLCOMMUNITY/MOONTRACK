import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { IconPlus } from '@tabler/icons-react'

type Payment = {
  id: string
  amount: number
  commission_earned: number
  payment_date: string
  status: string
  transaction_ref: string | null
  influencer_name: string
}

type Influencer = { id: string; full_name: string }

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}



export function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const [infId, setInfId] = useState('')
  const [amount, setAmount] = useState('')
  const [commission, setCommission] = useState('')
  const [txRef, setTxRef] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const [{ data: p }, { data: inf }] = await Promise.all([
      supabase.from('payments').select('id, amount, commission_earned, payment_date, status, transaction_ref, influencers(full_name)').order('payment_date', { ascending: false }),
      supabase.from('influencers').select('id, full_name'),
    ])
    setPayments((p ?? []).map((x: any) => ({ ...x, influencer_name: x.influencers?.full_name ?? '—' })))
    setInfluencers((inf as Influencer[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate() {
    if (!infId || !amount || !commission) { toast.error('Fill all required fields'); return }
    setSubmitting(true)
    const { error } = await supabase.from('payments').insert({
      influencer_id: infId,
      amount: parseFloat(amount),
      commission_earned: parseFloat(commission),
      status: 'confirmed',
      transaction_ref: txRef || null,
    })
    if (error) { toast.error(error.message) } else {
      toast.success('Payment recorded')
      setOpen(false); setInfId(''); setAmount(''); setCommission(''); setTxRef('')
      load()
    }
    setSubmitting(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('payments').update({ status }).eq('id', id)
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status } : p))
    toast.success('Status updated')
  }

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Payments</h1>
        <div className='ms-auto flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size='sm'><IconPlus className='me-1 size-4' />Record Payment</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader><DialogTitle>Record New Payment</DialogTitle></DialogHeader>
              <div className='space-y-4 py-2'>
                <div className='space-y-1.5'>
                  <Label>Influencer *</Label>
                  <Select value={infId} onValueChange={setInfId}>
                    <SelectTrigger><SelectValue placeholder='Select influencer' /></SelectTrigger>
                    <SelectContent>{influencers.map((i) => <SelectItem key={i.id} value={i.id}>{i.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <Label>Student Payment Amount (₦) *</Label>
                  <Input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='50000' />
                </div>
                <div className='space-y-1.5'>
                  <Label>Commission Earned (₦) *</Label>
                  <Input type='number' value={commission} onChange={(e) => setCommission(e.target.value)} placeholder='5000' />
                </div>
                <div className='space-y-1.5'>
                  <Label>Transaction Reference</Label>
                  <Input value={txRef} onChange={(e) => setTxRef(e.target.value)} placeholder='TXN_ABC123' />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={submitting}>{submitting ? 'Saving…' : 'Record Payment'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ThemeSwitch /><ProfileDropdown />
        </div>
      </Header>
      <Main>
        <Card>
          <CardHeader><CardTitle className='text-base font-semibold'>All Payments</CardTitle></CardHeader>
          <CardContent className='p-0'>
            {loading ? (
              <div className='space-y-3 p-6'>{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className='h-10 w-full' />)}</div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influencer</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                      <TableHead className='text-right'>Commission</TableHead>
                      <TableHead>Ref</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className='font-medium'>{p.influencer_name}</TableCell>
                        <TableCell className='text-right'>{fmt(p.amount)}</TableCell>
                        <TableCell className='text-right font-semibold text-green-600 dark:text-green-400'>{fmt(p.commission_earned)}</TableCell>
                        <TableCell className='font-mono text-xs text-muted-foreground'>{p.transaction_ref ?? '—'}</TableCell>
                        <TableCell className='whitespace-nowrap text-xs text-muted-foreground'>{new Date(p.payment_date).toLocaleDateString('en-GB')}</TableCell>
                        <TableCell>
                          <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                            <SelectTrigger className='h-7 w-28 text-xs'><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['confirmed', 'pending', 'reversed'].map((s) => (
                                <SelectItem key={s} value={s} className='text-xs capitalize'>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
