import { useAnalytics } from '@/hooks/use-analytics'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AnalyticsChart } from './analytics-chart'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function Analytics() {
  const { data, loading } = useAnalytics()

  return (
    <div className='space-y-4'>
      {/* Main area chart */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Performance</CardTitle>
          <CardDescription>
            Weekly clicks vs. conversions across all referral links
          </CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          <AnalyticsChart data={data.weeklyChart} />
        </CardContent>
      </Card>

      {/* 4 stat mini-cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Total Link Clicks */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Link Clicks
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M3 3v18h18' />
              <path d='M7 15l4-4 4 4 4-6' />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <div className='text-2xl font-bold'>
                {data.totalClicks.toLocaleString()}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>
              Across all referral links
            </p>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Conversion Rate
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <circle cx='12' cy='7' r='4' />
              <path d='M6 21v-2a6 6 0 0 1 12 0v2' />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className='h-8 w-20' />
            ) : (
              <div className='text-2xl font-bold'>{data.conversionRate}%</div>
            )}
            <p className='text-xs text-muted-foreground'>
              Clicks that became students
            </p>
          </CardContent>
        </Card>

        {/* Avg. Commission */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Avg. Commission
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className='h-8 w-28' />
            ) : (
              <div className='text-2xl font-bold'>
                {fmt(data.avgCommission)}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>
              Per confirmed payment
            </p>
          </CardContent>
        </Card>

        {/* Active Links */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Links</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
              <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className='h-8 w-12' />
            ) : (
              <div className='text-2xl font-bold'>{data.activeLinks}</div>
            )}
            <p className='text-xs text-muted-foreground'>
              Referral links in use
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom two bar lists */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        {/* Top Performing Links */}
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>
              Referral codes ranked by total conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className='h-8 w-full' />
                ))}
              </div>
            ) : data.topLinks.length === 0 ? (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                No conversions yet
              </p>
            ) : (
              <SimpleBarList
                items={data.topLinks}
                barClass='bg-primary'
                valueFormatter={(n) => `${n} conversion${n !== 1 ? 's' : ''}`}
              />
            )}
          </CardContent>
        </Card>

        {/* Conversion Status Breakdown */}
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Conversion Status</CardTitle>
            <CardDescription>Breakdown of payment outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className='h-8 w-full' />
                ))}
              </div>
            ) : (
              <SimpleBarList
                items={data.statusBreakdown}
                barClass='bg-muted-foreground'
                valueFormatter={(n) => `${n}%`}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass,
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  barClass: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className='space-y-3'>
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`
        return (
          <li key={i.name} className='flex items-center justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 truncate text-xs text-muted-foreground'>
                {i.name}
              </div>
              <div className='h-2.5 w-full rounded-full bg-muted'>
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className='ps-2 text-xs font-medium tabular-nums'>
              {valueFormatter(i.value)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
