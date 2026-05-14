import { IconLink, IconPointer, IconUsers } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { CopyInput } from '@/components/copy-input'
import { useReferrals, type ReferralLink } from '@/hooks/use-referrals'

const BASE_URL = 'https://moontechlife.com/register'

function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge
      variant='outline'
      className='border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
    >
      Active
    </Badge>
  ) : (
    <Badge
      variant='outline'
      className='border-zinc-400/30 bg-zinc-400/10 text-zinc-500 dark:text-zinc-400'
    >
      Inactive
    </Badge>
  )
}

function LinkCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-4 w-48' />
      </CardHeader>
      <CardContent className='space-y-3'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </CardContent>
    </Card>
  )
}

function LinkCard({ link }: { link: ReferralLink }) {
  const fullUrl = `${BASE_URL}?ref=${link.ref_code}`

  return (
    <Card className='flex flex-col gap-0'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-base font-semibold'>
            <IconLink className='size-4 text-muted-foreground' />
            {link.ref_code}
          </CardTitle>
          <StatusBadge isActive={link.is_active} />
        </div>
        <CardDescription className='text-xs'>
          Target: {link.target_url || BASE_URL}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3 pt-0'>
        <CopyInput value={link.ref_code} label='Referral Code' />
        <CopyInput value={fullUrl} label='Full Referral Link' />

        {/* Stats row */}
        <div className='mt-2 grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3'>
          <div className='flex items-center gap-2'>
            <IconPointer className='size-4 text-muted-foreground' />
            <div>
              <p className='text-xs text-muted-foreground'>Clicks</p>
              <p className='text-lg font-bold leading-tight'>
                {link.click_count.toLocaleString()}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <IconUsers className='size-4 text-muted-foreground' />
            <div>
              <p className='text-xs text-muted-foreground'>Conversions</p>
              <p className='text-lg font-bold leading-tight'>
                {(link.conversion_count ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Referrals() {
  const { links, loading, error } = useReferrals()

  return (
    <>
      {/* Header */}
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Referral Links</h1>
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
            Failed to load referral links: {error}
          </div>
        )}

        {/* How it works banner */}
        <div className='mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground'>
          <span className='font-medium text-foreground'>How it works: </span>
          Share your referral link. When someone registers and pays, you earn
          your commission automatically.
        </div>

        {/* Loading state */}
        {loading && (
          <div className='grid gap-4 md:grid-cols-2'>
            <LinkCardSkeleton />
            <LinkCardSkeleton />
          </div>
        )}

        {/* Link cards (desktop also shows as table) */}
        {!loading && links.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-2 rounded-lg border py-20 text-center text-muted-foreground'>
            <IconLink className='size-10 opacity-30' />
            <p className='text-sm font-medium'>No referral links assigned yet</p>
            <p className='text-xs'>
              Contact your manager to get your referral link set up.
            </p>
          </div>
        )}

        {!loading && links.length > 0 && (
          <>
            {/* Cards (mobile-friendly) */}
            <div className='mb-6 grid gap-4 md:grid-cols-2 xl:hidden'>
              {links.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>

            {/* Table (desktop) */}
            <Card className='hidden xl:block'>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>
                  All Referral Links
                </CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ref Code</TableHead>
                      <TableHead>Full Link</TableHead>
                      <TableHead className='text-right'>Clicks</TableHead>
                      <TableHead className='text-right'>Conversions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => {
                      const fullUrl = `${BASE_URL}?ref=${link.ref_code}`
                      return (
                        <TableRow key={link.id}>
                          <TableCell className='font-mono font-semibold'>
                            {link.ref_code}
                          </TableCell>
                          <TableCell className='max-w-xs'>
                            <span className='block truncate font-mono text-xs text-muted-foreground'>
                              {fullUrl}
                            </span>
                          </TableCell>
                          <TableCell className='text-right font-semibold'>
                            {link.click_count.toLocaleString()}
                          </TableCell>
                          <TableCell className='text-right font-semibold'>
                            {(link.conversion_count ?? 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <StatusBadge isActive={link.is_active} />
                          </TableCell>
                          <TableCell>
                            <CopyInput value={fullUrl} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </Main>
    </>
  )
}
