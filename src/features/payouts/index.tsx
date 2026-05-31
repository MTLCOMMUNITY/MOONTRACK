import { IconWallet, IconCash, IconClock } from '@tabler/icons-react'
import { usePayouts, type Payout } from '@/hooks/use-payouts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

function fmt(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: Payout['status'] }) {
  const map: Record<Payout['status'], { label: string; className: string }> = {
    paid: {
      label: 'Paid',
      className:
        'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    },
    pending: {
      label: 'Pending',
      className:
        'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    failed: {
      label: 'Failed',
      className:
        'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
    },
  }
  // eslint-disable-next-line security/detect-object-injection
  const v = map[status] ?? map.pending
  return (
    <Badge variant='outline' className={v.className}>
      {v.label}
    </Badge>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string
  value: string
  icon: React.ElementType
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        <Icon className='size-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className='h-7 w-32' />
        ) : (
          <div className='text-2xl font-bold tracking-tight'>{value}</div>
        )}
      </CardContent>
    </Card>
  )
}

export function Payouts() {
  const { payouts, loading, error, totalPaid, totalPending } = usePayouts()

  return (
    <>
      {/* Header */}
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Payouts</h1>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Main content */}
      <Main>
        {/* Error */}
        {error && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'>
            Failed to load payouts: {error}
          </div>
        )}

        {/* Summary cards */}
        <div className='mb-6 grid gap-4 sm:grid-cols-3'>
          <SummaryCard
            title='Total Paid Out'
            value={fmt(totalPaid)}
            icon={IconCash}
            loading={loading}
          />
          <SummaryCard
            title='Pending Payouts'
            value={fmt(totalPending)}
            icon={IconClock}
            loading={loading}
          />
          <SummaryCard
            title='Total Transactions'
            value={loading ? '—' : String(payouts.length)}
            icon={IconWallet}
            loading={loading}
          />
        </div>

        {/* Payouts table */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>
              Payout History
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            {loading ? (
              <div className='space-y-3 p-6'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className='h-10 w-full' />
                ))}
              </div>
            ) : payouts.length === 0 ? (
              <div className='flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground'>
                <IconWallet className='size-10 opacity-30' />
                <p className='text-sm font-medium'>No payouts recorded yet</p>
                <p className='text-xs'>
                  Payouts will appear here once your commission is disbursed.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className='text-sm whitespace-nowrap'>
                          {fmtDate(p.payout_date)}
                        </TableCell>
                        <TableCell className='text-right font-semibold text-green-600 dark:text-green-400'>
                          {fmt(p.amount)}
                        </TableCell>
                        <TableCell className='capitalize'>{p.method}</TableCell>
                        <TableCell className='font-mono text-xs text-muted-foreground'>
                          {p.reference ?? '—'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                        <TableCell className='max-w-xs truncate text-xs text-muted-foreground'>
                          {p.note ?? '—'}
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
