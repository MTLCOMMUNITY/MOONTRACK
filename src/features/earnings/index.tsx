import { IconCash, IconCreditCard, IconClock } from '@tabler/icons-react'
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
import { LiveBadge } from '@/components/live-badge'
import { useEarnings, type Payment } from '@/hooks/use-earnings'

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

function StatusBadge({ status }: { status: Payment['status'] }) {
  const variants: Record<Payment['status'], { label: string; className: string }> = {
    confirmed: {
      label: 'Confirmed',
      className:
        'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    },
    pending: {
      label: 'Pending',
      className:
        'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    reversed: {
      label: 'Reversed',
      className:
        'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
    },
  }
  const v = variants[status] ?? variants.pending
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

export function Earnings() {
  const { payments, summary, loading, error, isLive } = useEarnings()

  return (
    <>
      {/* Header */}
      <Header>
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-semibold tracking-tight'>Earnings</h1>
          <LiveBadge isLive={isLive} />
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Main content */}
      <Main>
        {/* Error state */}
        {error && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'>
            Failed to load earnings data: {error}
          </div>
        )}

        {/* Summary cards */}
        <div className='mb-6 grid gap-4 sm:grid-cols-3'>
          <SummaryCard
            title='Total Commission Earned'
            value={fmt(summary.totalEarned)}
            icon={IconCash}
            loading={loading}
          />
          <SummaryCard
            title='Total Paid Out'
            value={fmt(summary.totalPaidOut)}
            icon={IconCreditCard}
            loading={loading}
          />
          <SummaryCard
            title='Pending Balance'
            value={fmt(summary.pendingBalance)}
            icon={IconClock}
            loading={loading}
          />
        </div>

        {/* Payments table */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            {loading ? (
              <div className='space-y-3 p-6'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className='h-10 w-full' />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className='flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground'>
                <IconCash className='size-10 opacity-30' />
                <p className='text-sm font-medium'>No payments recorded yet</p>
                <p className='text-xs'>
                  Payments will appear here once conversions are confirmed.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className='text-right'>Amount Paid</TableHead>
                      <TableHead className='text-right'>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction Ref</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className='whitespace-nowrap text-sm'>
                          {fmtDate(p.payment_date)}
                        </TableCell>
                        <TableCell>
                          <div className='font-medium'>
                            {p.conversions?.student_name ?? '—'}
                          </div>
                          {p.conversions?.student_email && (
                            <div className='text-xs text-muted-foreground'>
                              {p.conversions.student_email}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className='text-right font-medium'>
                          {fmt(p.amount)}
                        </TableCell>
                        <TableCell className='text-right font-semibold text-green-600 dark:text-green-400'>
                          {fmt(p.commission_earned)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={p.status} />
                        </TableCell>
                        <TableCell className='font-mono text-xs text-muted-foreground'>
                          {p.transaction_ref ?? '—'}
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
