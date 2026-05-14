import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

type Payout = {
  id: string
  amount: number
  payout_date: string
  method: string
  reference: string | null
  status: string
  note: string | null
  influencer_name: string
}

type Influencer = { id: string; full_name: string }

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}



export function AdminPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const [infId, setInfId] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank_transfer')
  const [reference, setReference] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const [{ data: p }, { data: inf }] = await Promise.all([
      supabase.from('payouts').select('id, amount, payout_date, method, reference, status, note, influencers(full_name)').order('payout_date', { ascending: false }),
      supabase.from('influencers').select('id, full_name'),
    ])
    setPayouts((p ?? []).map((x: any) => ({ ...x, influencer_name: x.influencers?.full_name ?? '—' })))
    setInfluencers((inf as Influencer[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate() {
    if (!infId || !amount) { toast.error('Select influencer and enter amount'); return }
    setSubmitting(true)
    const { error } = await supabase.from('payouts').insert({
      influencer_id: infId,
      amount: parseFloat(amount),
      method,
      reference: reference || null,
      status: 'paid',
      note: note || null,
    })
    if (error) { toast.error(error.message) } else {
      toast.success('Payout recorded')
      setOpen(false); setInfId(''); setAmount(''); setMethod('bank_transfer'); setReference(''); setNote('')
      load()
    }
    setSubmitting(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('payouts').update({ status }).eq('id', id)
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status } : p))
    toast.success('Status updated')
  }

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Payouts</h1>
        <div className='ms-auto flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size='sm'><IconPlus className='me-1 size-4' />Record Payout</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader><DialogTitle>Record New Payout</DialogTitle></DialogHeader>
              <div className='space-y-4 py-2'>
                <div className='space-y-1.5'>
                  <Label>Influencer *</Label>
                  <Select value={infId} onValueChange={setInfId}>
                    <SelectTrigger><SelectValue placeholder='Select influencer' /></SelectTrigger>
                    <SelectContent>{influencers.map((i) => <SelectItem key={i.id} value={i.id}>{i.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <Label>Amount (₦) *</Label>
                  <Input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='15000' />
                </div>
                <div className='space-y-1.5'>
                  <Label>Payment Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
                      <SelectItem value='cash'>Cash</SelectItem>
                      <SelectItem value='mobile_money'>Mobile Money</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <Label>Reference / Receipt No.</Label>
                  <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder='TXN_XYZ789' />
                </div>
                <div className='space-y-1.5'>
                  <Label>Note</Label>
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder='Optional note…' className='resize-none' rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={submitting}>{submitting ? 'Saving…' : 'Record Payout'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ThemeSwitch /><ProfileDropdown />
        </div>
      </Header>
      <Main>
        <Card>
          <CardHeader><CardTitle className='text-base font-semibold'>All Payouts</CardTitle></CardHeader>
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
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className='py-12 text-center text-sm text-muted-foreground'>No payouts yet.</TableCell></TableRow>
                    ) : payouts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className='font-medium'>{p.influencer_name}</TableCell>
                        <TableCell className='text-right font-semibold'>{fmt(p.amount)}</TableCell>
                        <TableCell className='capitalize text-sm'>{p.method.replace('_', ' ')}</TableCell>
                        <TableCell className='font-mono text-xs text-muted-foreground'>{p.reference ?? '—'}</TableCell>
                        <TableCell className='whitespace-nowrap text-xs text-muted-foreground'>{new Date(p.payout_date).toLocaleDateString('en-GB')}</TableCell>
                        <TableCell>
                          <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                            <SelectTrigger className='h-7 w-24 text-xs'><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['paid', 'pending', 'failed'].map((s) => (
                                <SelectItem key={s} value={s} className='text-xs capitalize'>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className='max-w-[160px] truncate text-xs text-muted-foreground'>{p.note ?? '—'}</TableCell>
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
