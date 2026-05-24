import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Reports } from './components/reports'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { useDashboard } from '@/hooks/use-dashboard'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  IconLink,
  IconUsers,
  IconCash,
  IconClock,
} from '@tabler/icons-react'

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
    if (currentUser.isAdmin) {
      navigate({ to: '/optcontrol' })
    }
  }, [currentUser.isAdmin])

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
              <TabsTrigger value='reports'>
                Reports
              </TabsTrigger>
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
                  <IconLink className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className='h-8 w-24' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {stats.totalClicks.toLocaleString()}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Across all referral links
                  </p>
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

              {/* Pending Balance */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pending Balance
                  </CardTitle>
                  <IconClock className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className='h-8 w-28' />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {fmt(stats.pendingBalance)}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Awaiting confirmation
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
