import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs'
import {
  IconPlus, IconDotsVertical, IconBan, IconCheck, IconTrash,
  IconLink, IconUsers, IconCash, IconClock, IconCopy
} from '@tabler/icons-react'

type Influencer = {
  id: string
  full_name: string
  email: string
  ref_code: string
  commission_rate: number
  is_active: boolean
  invite_accepted: boolean
  created_at: string
}

type InfluencerDetails = {
  totalClicks: number
  totalConversions: number
  totalEarnings: number
  totalPaidOut: number
  pendingBalance: number
  conversionRate: number
  conversions: Array<{
    id: string
    student_name: string
    student_email: string
    registered_at: string
    payment_status: string
    amount_paid: number | null
  }>
  payouts: Array<{
    id: string
    payout_date: string
    amount: number
    method: string
    reference: string | null
    note: string | null
  }>
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

export function AdminInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null)

  // New influencer form state
  const [inviteEmail, setInviteEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [refCode, setRefCode] = useState('')
  const [commissionRate, setCommissionRate] = useState('10')
  const [submitting, setSubmitting] = useState(false)

  // Influencer details popup state
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null)
  const [details, setDetails] = useState<InfluencerDetails | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function load() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-get-influencers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load influencers')
      
      setInfluencers((data as Influencer[]) ?? [])
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to load influencers')
    } finally {
      setLoading(false)
    }
  }

  async function loadDetails(id: string) {
    setDetailsLoading(true)
    setDetails(null)
    try {
      // 1. Fetch total clicks — sum click_count across ALL referral links for this influencer
      //    (includes inactive links to capture historical traffic correctly)
      const { data: linkData, error: clicksError } = await supabase
        .from('referral_links')
        .select('click_count')
        .eq('influencer_id', id)

      if (clicksError) throw clicksError

      // 2. Fetch conversions list (for history table)
      const { data: conversions, error: convError } = await supabase
        .from('conversions')
        .select('id, student_name, student_email, registered_at, payment_status, payments(amount)')
        .eq('influencer_id', id)
        .order('registered_at', { ascending: false })

      if (convError) throw convError

      // 3. Fetch earnings from payments table (confirmed only)
      const { data: payments, error: payError } = await supabase
        .from('payments')
        .select('commission_earned')
        .eq('influencer_id', id)
        .eq('status', 'confirmed')

      if (payError) throw payError

      // 4. Fetch payouts history (for history table)
      const { data: payouts, error: payoutError } = await supabase
        .from('payouts')
        .select('id, payout_date, amount, method, reference, note')
        .eq('influencer_id', id)
        .order('payout_date', { ascending: false })

      if (payoutError) throw payoutError

      // Calculate correct totals (no JOIN fan-out inflation)
      const totalClicks = (linkData ?? []).reduce((sum, l) => sum + (l.click_count ?? 0), 0)
      const totalConversions = conversions?.length ?? 0
      const totalEarnings = (payments ?? []).reduce((sum, p) => sum + (p.commission_earned ?? 0), 0)
      const totalPaidOut = (payouts ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0)
      const pendingBalance = Math.max(0, totalEarnings - totalPaidOut)
      const conversionRate = totalClicks > 0 ? parseFloat(((totalConversions / totalClicks) * 100).toFixed(1)) : 0

      const rawConversions = conversions as unknown as Array<{
        id: string
        student_name: string | null
        student_email: string | null
        registered_at: string
        payment_status: string
        payments: Array<{ amount: number }> | { amount: number } | null
      }> | null

      setDetails({
        totalClicks,
        totalConversions,
        totalEarnings,
        totalPaidOut,
        pendingBalance,
        conversionRate,
        conversions: (rawConversions ?? []).map((c) => {
          const paymentsArray = Array.isArray(c.payments)
            ? c.payments
            : c.payments
              ? [c.payments]
              : []
          return {
            id: c.id,
            student_name: c.student_name ?? '—',
            student_email: c.student_email ?? '—',
            registered_at: c.registered_at,
            payment_status: c.payment_status,
            amount_paid: paymentsArray[0]?.amount ?? null,
          }
        }),
        payouts: (payouts ?? []).map((p) => ({
          id: p.id,
          payout_date: p.payout_date,
          amount: p.amount ?? 0,
          method: p.method ?? 'bank_transfer',
          reference: p.reference,
          note: p.note,
        })),
      })
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to load influencer details')
    } finally {
      setDetailsLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleInvite() {
    if (!inviteEmail || !fullName || !refCode) {
      toast.error('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-influencer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          email: inviteEmail,
          full_name: fullName,
          ref_code: refCode,
          commission_rate: parseFloat(commissionRate) || 10
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to invite')

      toast.success(`Invite sent to ${inviteEmail}`)
      setOpen(false)
      setInviteEmail(''); setFullName(''); setRefCode(''); setCommissionRate('10')
      load()
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to invite')
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/toggle-influencer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          influencer_id: id,
          is_active: !currentStatus
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update status')

      toast.success(`Influencer ${!currentStatus ? 'reactivated' : 'suspended'} successfully`)
      load()
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to update status')
    }
  }

  async function handleDelete(id: string, name: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-influencer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          influencer_id: id
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete influencer')

      toast.success(`Influencer ${name} completely deleted.`)
      setDeleteTarget(null)
      load()
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to delete influencer')
    }
  }

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Influencers</h1>
        <div className='ms-auto flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size='sm'><IconPlus className='me-1 size-4' /> Invite Influencer</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Invite New Influencer</DialogTitle>
              </DialogHeader>
              <div className='space-y-4 py-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='inv-name'>Full Name *</Label>
                  <Input id='inv-name' value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='John Doe' />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='inv-email'>Email *</Label>
                  <Input id='inv-email' type='email' value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder='influencer@example.com' />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='inv-ref'>Referral Code *</Label>
                  <Input id='inv-ref' value={refCode} onChange={(e) => setRefCode(e.target.value.toUpperCase())} placeholder='ref_MOON01' />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='inv-rate'>Commission Rate (%)</Label>
                  <Input id='inv-rate' type='number' value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} min='0' max='100' />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInvite} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Invite'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <Card>
          <CardHeader><CardTitle className='text-base font-semibold'>All Influencers ({influencers.length})</CardTitle></CardHeader>
          <CardContent className='p-0'>
            {loading ? (
              <div className='space-y-3 p-6'>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-10 w-full' />)}</div>
            ) : influencers.length === 0 ? (
              <div className='py-16 text-center text-sm text-muted-foreground'>No influencers yet. Invite one above.</div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Ref Code</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {influencers.map((inf) => (
                      <TableRow 
                        key={inf.id}
                        className='cursor-pointer hover:bg-muted/50'
                        onClick={() => {
                          setSelectedInfluencer(inf)
                          loadDetails(inf.id)
                        }}
                      >
                        <TableCell>
                          <div className='font-medium'>{inf.full_name}</div>
                          <div className='text-xs text-muted-foreground'>{inf.email}</div>
                        </TableCell>
                        <TableCell><Badge variant='outline' className='font-mono'>{inf.ref_code}</Badge></TableCell>
                        <TableCell>{inf.commission_rate}%</TableCell>
                        <TableCell>
                          {!inf.is_active ? (
                            <Badge variant='destructive'>Suspended</Badge>
                          ) : !inf.invite_accepted ? (
                            <Badge variant='outline' className='bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20'>
                              Pending (Invite Sent)
                            </Badge>
                          ) : (
                            <Badge className='bg-green-600 hover:bg-green-700'>
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className='text-sm text-muted-foreground'>Influencer</TableCell>
                        <TableCell className='text-xs text-muted-foreground'>
                          {new Date(inf.created_at).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <IconDotsVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem onClick={() => toggleStatus(inf.id, inf.is_active)} className={inf.is_active ? 'text-orange-600' : 'text-green-600'}>
                                {inf.is_active ? <><IconBan className='mr-2 h-4 w-4' /> Suspend Influencer</> : <><IconCheck className='mr-2 h-4 w-4' /> Reactivate Influencer</>}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setDeleteTarget({ id: inf.id, name: inf.full_name })} className='text-red-600'>
                                <IconTrash className='mr-2 h-4 w-4' /> Delete Influencer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete <strong>{deleteTarget?.name}</strong> and remove all their referral links from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleteTarget) handleDelete(deleteTarget.id, deleteTarget.name)
            }} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedInfluencer} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedInfluencer(null)
          setDetails(null)
        }
      }}>
        <DialogContent className='sm:max-w-6xl max-w-full max-h-[95vh] overflow-y-auto p-6'>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Influencer Profile & Statistics</DialogTitle>
          </DialogHeader>

          {detailsLoading && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-[250px] w-full rounded-xl" />
            </div>
          )}

          {!detailsLoading && selectedInfluencer && (
            <div className="space-y-6 py-4">
              {/* Profile Card Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#0A0F1E]/10 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {selectedInfluencer.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">{selectedInfluencer.full_name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedInfluencer.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2 rounded-lg border bg-white px-3 py-1.5 dark:bg-slate-900">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ref Code:</span>
                    <code className="text-xs font-mono font-bold text-yellow-600 dark:text-yellow-400">{selectedInfluencer.ref_code}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedInfluencer.ref_code)
                        setCopied(true)
                        toast.success('Code copied!')
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded cursor-pointer"
                      title="Copy referral code"
                    >
                      {copied ? <IconCheck className="h-3.5 w-3.5 text-green-500" /> : <IconCopy className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!selectedInfluencer.is_active ? (
                      <Badge variant="destructive">Suspended</Badge>
                    ) : !selectedInfluencer.invite_accepted ? (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Pending Invite
                      </Badge>
                    ) : (
                      <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              {details && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Clicks</CardTitle>
                      <IconLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">{details.totalClicks.toLocaleString()}</div>
                      <p className="text-[10px] text-muted-foreground mt-1">Total page entries</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Conversions</CardTitle>
                      <IconUsers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">{details.totalConversions.toLocaleString()}</div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {details.conversionRate}% Conv. Rate
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Commission</CardTitle>
                      <IconCash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">{fmt(details.totalEarnings)}</div>
                      <p className="text-[10px] text-muted-foreground mt-1">Total earned commissions</p>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-500/20 bg-yellow-500/[0.02]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Pending Bal</CardTitle>
                      <IconClock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{fmt(details.pendingBalance)}</div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Paid out: {fmt(details.totalPaidOut)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* History Tabs */}
              {details && (
                <Tabs defaultValue="conversions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="conversions">Conversions ({details.conversions.length})</TabsTrigger>
                    <TabsTrigger value="payouts">Payouts ({details.payouts.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="conversions" className="mt-4 border rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                    {details.conversions.length === 0 ? (
                      <div className="py-12 text-center text-sm text-muted-foreground">
                        No registrations recorded for this influencer yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Amount Paid</TableHead>
                              <TableHead>Registered Date</TableHead>
                              <TableHead>Payment Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {details.conversions.map((c) => (
                              <TableRow key={c.id}>
                                <TableCell className="font-medium text-sm">{c.student_name}</TableCell>
                                <TableCell className="text-sm">{c.student_email}</TableCell>
                                <TableCell className="font-medium text-sm text-green-600 dark:text-green-400">
                                  {c.amount_paid ? fmt(c.amount_paid) : '—'}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {new Date(c.registered_at).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      c.payment_status === 'paid'
                                        ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                                        : c.payment_status === 'pending'
                                          ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                          : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                                    }
                                  >
                                    {c.payment_status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="payouts" className="mt-4 border rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                    {details.payouts.length === 0 ? (
                      <div className="py-12 text-center text-sm text-muted-foreground">
                        No payouts recorded yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Reference</TableHead>
                              <TableHead>Note</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {details.payouts.map((p) => (
                              <TableRow key={p.id}>
                                <TableCell className="whitespace-nowrap text-sm">
                                  {new Date(p.payout_date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </TableCell>
                                <TableCell className="font-semibold text-sm text-green-600 dark:text-green-400">
                                  {fmt(p.amount)}
                                </TableCell>
                                <TableCell className="capitalize text-sm">{p.method.replace('_', ' ')}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                  {p.reference ?? '—'}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {p.note ?? '—'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
