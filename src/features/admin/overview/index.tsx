import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  IconUsers, IconCash, IconLink, IconWallet,
} from '@tabler/icons-react'

type InfluencerStat = {
  id: string
  full_name: string
  email: string
  ref_code: string
  commission_rate: number
  total_clicks: number
  total_conversions: number
  commission_earned: number
  pending_balance: number
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n)
}

export function AdminOverview() {
  const [rows, setRows] = useState<InfluencerStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('influencer_dashboard_summary')
      .select('*')
      .then(({ data }) => {
        setRows((data as InfluencerStat[]) ?? [])
        setLoading(false)
      })
  }, [])

  const totals = rows.reduce(
    (acc, r) => ({
      clicks: acc.clicks + r.total_clicks,
      conversions: acc.conversions + r.total_conversions,
      earned: acc.earned + r.commission_earned,
      pending: acc.pending + r.pending_balance,
    }),
    { clicks: 0, conversions: 0, earned: 0, pending: 0 }
  )

  const statCards = [
    { title: 'Total Influencers', value: rows.length, icon: IconUsers },
    { title: 'Total Clicks', value: totals.clicks.toLocaleString(), icon: IconLink },
    { title: 'Total Earned', value: fmt(totals.earned), icon: IconCash },
    { title: 'Pending Balance', value: fmt(totals.pending), icon: IconWallet },
  ]

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Control Panel</h1>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {statCards.map(({ title, value, icon: Icon }) => (
            <Card key={title}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
                <Icon className='size-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className='h-7 w-24' /> : <div className='text-2xl font-bold'>{value}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle className='text-base font-semibold'>All Influencers</CardTitle></CardHeader>
          <CardContent className='p-0'>
            {loading ? (
              <div className='space-y-3 p-6'>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-10 w-full' />)}</div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Ref Code</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className='text-right'>Clicks</TableHead>
                      <TableHead className='text-right'>Conversions</TableHead>
                      <TableHead className='text-right'>Earned</TableHead>
                      <TableHead className='text-right'>Pending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className='font-medium'>{r.full_name}</div>
                          <div className='text-xs text-muted-foreground'>{r.email}</div>
                        </TableCell>
                        <TableCell><Badge variant='outline' className='font-mono'>{r.ref_code}</Badge></TableCell>
                        <TableCell>{r.commission_rate}%</TableCell>
                        <TableCell className='text-right'>{r.total_clicks.toLocaleString()}</TableCell>
                        <TableCell className='text-right'>{r.total_conversions.toLocaleString()}</TableCell>
                        <TableCell className='text-right font-semibold text-green-600 dark:text-green-400'>{fmt(r.commission_earned)}</TableCell>
                        <TableCell className='text-right text-yellow-600 dark:text-yellow-400'>{fmt(r.pending_balance)}</TableCell>
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
