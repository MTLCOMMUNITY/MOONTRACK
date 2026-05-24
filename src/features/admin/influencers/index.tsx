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
import { IconPlus, IconDotsVertical, IconBan, IconCheck, IconTrash } from '@tabler/icons-react'

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

export function AdminInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // New influencer form state
  const [inviteEmail, setInviteEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [refCode, setRefCode] = useState('')
  const [commissionRate, setCommissionRate] = useState('10')
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-get-influencers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load influencers')
      
      setInfluencers((data as Influencer[]) ?? [])
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to load influencers')
    } finally {
      setLoading(false)
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
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to invite')
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
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update status')
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Are you absolutely sure you want to hard-delete influencer ${name}? This cannot be undone and will delete their referral links.`)) {
      return
    }
    
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
      load()
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to delete influencer')
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
                      <TableRow key={inf.id}>
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
                        <TableCell>
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
                              <DropdownMenuItem onClick={() => handleDelete(inf.id, inf.full_name)} className='text-red-600'>
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
    </>
  )
}
