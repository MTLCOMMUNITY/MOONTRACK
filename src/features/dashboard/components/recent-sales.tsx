import type { RecentConversion } from '@/hooks/use-dashboard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface RecentSalesProps {
  conversions: RecentConversion[]
  loading: boolean
}

export function RecentSales({ conversions, loading }: RecentSalesProps) {
  if (loading) {
    return (
      <div className='space-y-8'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex items-center gap-4'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-1'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-40' />
              </div>
              <Skeleton className='h-4 w-16' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversions.length === 0) {
    return (
      <p className='py-6 text-center text-sm text-muted-foreground'>
        No conversions yet.
      </p>
    )
  }

  return (
    <div className='space-y-8'>
      {conversions.map((c) => (
        <div key={c.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>{initials(c.student_name)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {c.student_name}
              </p>
              <p className='text-sm text-muted-foreground capitalize'>
                {c.payment_status}
              </p>
            </div>
            <div className='font-medium'>
              {c.commission_earned != null
                ? `+${fmt(c.commission_earned)}`
                : '—'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
