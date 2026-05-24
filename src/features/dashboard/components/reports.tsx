import { useReports } from '@/hooks/use-reports'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconDownload } from '@tabler/icons-react'

function fmt(amount: number | null) {
  if (amount === null) return '—'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function Reports() {
  const { data, loading, error } = useReports()

  const handleDownloadCSV = () => {
    if (!data.length) return

    // CSV Header
    const headers = [
      'Date',
      'Student Name',
      'Referral Code',
      'Payment Status',
      'Commission Earned (NGN)',
    ]
    
    // CSV Rows
    const rows = data.map((row) => [
      formatDate(row.registered_at),
      row.student_name,
      row.ref_code,
      row.payment_status,
      row.commission_earned?.toString() ?? '0',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `influencer-report-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-end'>
        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2'
          onClick={handleDownloadCSV}
          disabled={loading || data.length === 0}
        >
          <IconDownload className='h-4 w-4' />
          Download CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversions Report</CardTitle>
          <CardDescription>
            A detailed history of all your referrals and earned commissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className='py-4 text-center text-sm text-red-500'>
              Failed to load reports: {error}
            </p>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                        <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                        <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                        <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                        <TableCell className='text-right'><Skeleton className='ms-auto h-4 w-16' /></TableCell>
                      </TableRow>
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className='h-24 text-center'>
                        No referrals found. Share your link to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className='whitespace-nowrap'>
                          {formatDate(row.registered_at)}
                        </TableCell>
                        <TableCell className='font-medium'>
                          {row.student_name}
                        </TableCell>
                        <TableCell>{row.ref_code}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.payment_status === 'paid'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {row.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          {fmt(row.commission_earned)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
