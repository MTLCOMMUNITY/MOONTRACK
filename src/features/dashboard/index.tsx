import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { IconUsers, IconCash, IconWallet, IconClick } from '@tabler/icons-react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useDashboard } from '@/hooks/use-dashboard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { Reports } from './components/reports'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function Dashboard() {
  const { stats, recentConversions, loading } = useDashboard()
  const currentUser = useCurrentUser()
  const navigate = useNavigate()

  // Admins have no business on the influencer dashboard — send them to Control Panel
  useEffect(() => {
    if (!currentUser.loading && currentUser.isAdmin) {
      navigate({ to: '/optcontrol' })
    }
  }, [currentUser.loading, currentUser.isAdmin, navigate])

  if (currentUser.loading) {
    return (
      <>
        {/* Skeleton Top Heading */}
        <div className='mb-6 flex items-center justify-between'>
          <Skeleton className='h-8 w-32' />
          <Skeleton className='h-8 w-48' />
        </div>

        {/* Skeleton Stat Cards */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='space-y-4 rounded-xl border border-muted/40 p-6'
            >
              <div className='flex items-center justify-between'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-4 rounded-full' />
              </div>
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-3 w-32' />
            </div>
          ))}
        </div>

        {/* Skeleton Main Grid */}
        <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <div className='col-span-1 space-y-4 rounded-xl border border-muted/40 p-6 lg:col-span-4'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-[200px] w-full' />
          </div>
          <div className='col-span-1 space-y-4 rounded-xl border border-muted/40 p-6 lg:col-span-3'>
            <Skeleton className='h-6 w-32' />
            <div className='space-y-3'>
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-9 w-9 rounded-full' />
                    <div className='space-y-1'>
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                  </div>
                  <Skeleton className='h-4 w-12' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} className='me-auto' />
        <Search />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='overview' className='space-y-4'>
            {/* 4 Stat cards */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Total Clicks */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Clicks
                  </CardTitle>
                  <IconClick className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {stats.totalClicks.toLocaleString()}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>Link clicks</p>
                </CardContent>
              </Card>

              {/* Total Conversions */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Conversions
                  </CardTitle>
                  <IconUsers className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {stats.totalConversions.toLocaleString()}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Students referred
                  </p>
                </CardContent>
              </Card>

              {/* Commission Earned */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Commission Earned
                  </CardTitle>
                  <IconCash className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className='h-8 w-28' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {fmt(stats.commissionEarned)}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Confirmed payments
                  </p>
                </CardContent>
              </Card>

              {/* Unpaid Balance */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Unpaid Balance
                  </CardTitle>
                  <IconWallet className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className='h-8 w-28' />
                  ) : (
                    <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                      {fmt(stats.unpaidBalance)}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Available for payout
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart + Recent Conversions */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Conversions</CardTitle>
                  <CardDescription>
                    {loading
                      ? 'Loading...'
                      : `${recentConversions.length} recent referral${recentConversions.length !== 1 ? 's' : ''}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales
                    conversions={recentConversions}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
          <TabsContent value='reports' className='space-y-4'>
            <Reports />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    isActive: true,
    disabled: false,
  },
]
