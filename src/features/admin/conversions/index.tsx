import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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

type Conversion = {
  id: string
  student_name: string
  student_email: string
  ref_code: string
  registered_at: string
  payment_status: string
  influencer_name?: string
}

const STATUS_OPTIONS = ['pending', 'paid', 'failed', 'reversed']

const statusClass: Record<string, string> = {
  paid: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
  pending: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  failed: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  reversed: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
}

export function AdminConversions() {
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from('conversions')
      .select('id, student_name, student_email, ref_code, registered_at, payment_status, influencers(full_name)')
      .order('registered_at', { ascending: false })

    const rows = (data ?? []).map((c: any) => ({
      ...c,
      influencer_name: c.influencers?.full_name ?? '—',
    }))
    setConversions(rows)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    const { error } = await supabase
      .from('conversions')
      .update({ payment_status: status })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success('Status updated')
      setConversions((prev) => prev.map((c) => c.id === id ? { ...c, payment_status: status } : c))
    }
    setUpdating(null)
  }

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Conversions</h1>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch /><ProfileDropdown />
        </div>
      </Header>
      <Main>
        <Card>
          <CardHeader><CardTitle className='text-base font-semibold'>All Conversions ({conversions.length})</CardTitle></CardHeader>
          <CardContent className='p-0'>
            {loading ? (
              <div className='space-y-3 p-6'>{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className='h-10 w-full' />)}</div>
            ) : conversions.length === 0 ? (
              <div className='py-16 text-center text-sm text-muted-foreground'>No conversions yet.</div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Ref Code</TableHead>
                      <TableHead>Influencer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversions.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className='font-medium'>{c.student_name}</div>
                          <div className='text-xs text-muted-foreground'>{c.student_email}</div>
                        </TableCell>
                        <TableCell><Badge variant='outline' className='font-mono'>{c.ref_code}</Badge></TableCell>
                        <TableCell className='text-sm'>{c.influencer_name}</TableCell>
                        <TableCell className='whitespace-nowrap text-xs text-muted-foreground'>
                          {new Date(c.registered_at).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline' className={statusClass[c.payment_status] ?? statusClass.pending}>
                            {c.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={c.payment_status}
                            onValueChange={(val) => updateStatus(c.id, val)}
                            disabled={updating === c.id}
                          >
                            <SelectTrigger className='h-7 w-28 text-xs'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
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
