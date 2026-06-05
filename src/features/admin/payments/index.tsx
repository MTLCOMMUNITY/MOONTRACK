import { useEffect, useState } from 'react'
import {
  IconPlus,
  IconChevronDown,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

type Payment = {
  id: string
  amount: number
  commission_earned: number
  payment_date: string
  status: string
  transaction_ref: string | null
  influencer_name: string
}

type Influencer = { id: string; full_name: string; email: string }

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n)
}

export function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [openInfluencers, setOpenInfluencers] = useState<
    Record<string, boolean>
  >({})

  const [infId, setInfId] = useState('')
  const [amount, setAmount] = useState('')
  const [commission, setCommission] = useState('')
  const [txRef, setTxRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    const [{ data: p }, { data: inf }] = await Promise.all([
      supabase
        .from('payments')
        .select(
          'id, amount, commission_earned, payment_date, status, transaction_ref, influencers(full_name)'
        )
        .order('payment_date', { ascending: false }),
      supabase.from('influencers').select('id, full_name, email'),
    ])
    const rawPayments = p as unknown as
      | (Omit<Payment, 'influencer_name'> & {
          influencers: { full_name: string } | { full_name: string }[] | null
        })[]
      | null
    setPayments(
      (rawPayments ?? []).map((x) => {
        const inf = x.influencers
        const name = Array.isArray(inf) ? inf[0]?.full_name : inf?.full_name
        return {
          id: x.id,
          amount: x.amount,
          commission_earned: x.commission_earned,
          payment_date: x.payment_date,
          status: x.status,
          transaction_ref: x.transaction_ref,
          influencer_name: name ?? '—',
        }
      })
    )
    setInfluencers((inf as Influencer[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel('admin-payments-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'payments' }, () => load())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'payments' }, () => load())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'payments' }, () => load())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleCreate() {
    if (!infId || !amount || !commission) {
      toast.error('Fill all required fields')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('payments').insert({
      influencer_id: infId,
      amount: parseFloat(amount),
      commission_earned: parseFloat(commission),
      status: 'confirmed',
      transaction_ref: txRef || null,
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Payment recorded')
      setOpen(false)
      setInfId('')
      setAmount('')
      setCommission('')
      setTxRef('')
      load()
    }
    setSubmitting(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('payments').update({ status }).eq('id', id)
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    toast.success('Status updated')
  }

  async function confirmDelete() {
    if (!deleteId) return
    const id = deleteId
    setDeleteId(null)
    const { error } = await supabase.from('payments').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Payment deleted')
      setPayments((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Payments</h1>
        <div className='ms-auto flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size='sm'>
                <IconPlus className='me-1 size-4' />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
              </DialogHeader>
              <div className='space-y-4 py-2'>
                <div className='space-y-1.5'>
                  <Label>Influencer *</Label>
                  <Select value={infId} onValueChange={setInfId}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select influencer' />
                    </SelectTrigger>
                    <SelectContent>
                      {influencers.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.full_name} ({i.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <Label>Student Payment Amount (₦) *</Label>
                  <Input
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder='50000'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label>Commission Earned (₦) *</Label>
                  <Input
                    type='number'
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    placeholder='5000'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label>Transaction Reference</Label>
                  <Input
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    placeholder='TXN_ABC123'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={submitting}>
                  {submitting ? 'Saving…' : 'Record Payment'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-6 flex items-center gap-2'>
          <div className='relative max-w-sm flex-1'>
            <IconSearch className='absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search influencers...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className='space-y-3 p-6'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-full' />
              ))}
            </CardContent>
          </Card>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-center text-muted-foreground'>
              No payments found.
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            {Object.entries(
              payments.reduce(
                (acc, p) => {
                  if (!acc[p.influencer_name]) acc[p.influencer_name] = []
                  acc[p.influencer_name].push(p)
                  return acc
                },
                {} as Record<string, Payment[]>
              )
            )
              .filter(([name]) =>
                name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(([influencerName, infPayments]) => (
                <Collapsible
                  key={influencerName}
                  // eslint-disable-next-line security/detect-object-injection
                  open={openInfluencers[influencerName] ?? false}
                  onOpenChange={(isOpen) =>
                    setOpenInfluencers((prev) => ({
                      ...prev,
                      [influencerName]: isOpen,
                    }))
                  }
                >
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader className='flex cursor-pointer flex-row items-center justify-between bg-muted/30 py-3 transition-colors hover:bg-muted/50'>
                        <CardTitle className='text-sm font-semibold'>
                          {influencerName}{' '}
                          <span className='ml-2 font-normal text-muted-foreground'>
                            ({infPayments.length} payment
                            {infPayments.length === 1 ? '' : 's'})
                          </span>
                        </CardTitle>
                        <IconChevronDown
                          // eslint-disable-next-line security/detect-object-injection
                          className={`h-4 w-4 transition-transform duration-200 ${openInfluencers[influencerName] ? 'rotate-180' : ''}`}
                        />
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className='p-0'>
                        <div className='overflow-x-auto'>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className='w-[120px] text-right'>
                                  Amount
                                </TableHead>
                                <TableHead className='w-[120px] text-right'>
                                  Commission
                                </TableHead>
                                <TableHead>Ref</TableHead>
                                <TableHead className='w-[120px]'>
                                  Date
                                </TableHead>
                                <TableHead className='w-[150px]'>
                                  Status
                                </TableHead>
                                <TableHead className='w-[50px]'></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {infPayments.map((p) => (
                                <TableRow key={p.id}>
                                  <TableCell className='text-right'>
                                    {fmt(p.amount)}
                                  </TableCell>
                                  <TableCell className='text-right font-semibold text-green-600 dark:text-green-400'>
                                    {fmt(p.commission_earned)}
                                  </TableCell>
                                  <TableCell className='font-mono text-xs text-muted-foreground'>
                                    {p.transaction_ref ?? '—'}
                                  </TableCell>
                                  <TableCell className='text-xs whitespace-nowrap text-muted-foreground'>
                                    {new Date(
                                      p.payment_date
                                    ).toLocaleDateString('en-GB')}
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={p.status}
                                      onValueChange={(v) =>
                                        updateStatus(p.id, v)
                                      }
                                    >
                                      <SelectTrigger className='h-7 w-28 text-xs'>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[
                                          'confirmed',
                                          'pending',
                                          'reversed',
                                        ].map((s) => (
                                          <SelectItem
                                            key={s}
                                            value={s}
                                            className='text-xs capitalize'
                                          >
                                            {s}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant='ghost'
                                      size='icon'
                                      className='text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950'
                                      onClick={() => setDeleteId(p.id)}
                                    >
                                      <IconTrash className='size-4' />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
          </div>
        )}
      </Main>
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              payment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
