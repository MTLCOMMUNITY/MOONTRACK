import { useEffect, useState } from 'react'
import { IconDownload, IconTrendingUp, IconTrendingDown, IconFileTypePdf } from '@tabler/icons-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

type Transaction = {
  id: string
  date: string
  type: 'Payment' | 'Payout'
  influencer_name: string
  amount: number
  commission: number | null
  status: string
  reference: string | null
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(n)
}

function exportToCSV(transactions: Transaction[]) {
  const headers = [
    'Date',
    'Type',
    'Influencer Name',
    'Amount (NGN)',
    'Commission (NGN)',
    'Status',
    'Reference',
  ]
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('en-GB'),
    t.type,
    t.influencer_name,
    t.amount.toString(),
    t.commission ? t.commission.toString() : '0',
    t.status,
    t.reference || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((e) => e.map((field) => `"${field}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'moontrack-transactions-report.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportToPDF(transactions: Transaction[]) {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text('MoonTrack', 14, 22)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Official Transactions Statement', 14, 30)
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, 36)

  // Calculate totals
  let totalRevenue = 0
  let totalPayouts = 0
  transactions.forEach(t => {
    if (t.type === 'Payment') totalRevenue += t.amount
    else if (t.type === 'Payout') totalPayouts += t.amount
  })

  // Table
  const headers = [['Date', 'Type', 'Influencer Name', 'Amount (NGN)', 'Commission (NGN)', 'Status', 'Ref']]
  const data = transactions.map(t => [
    new Date(t.date).toLocaleDateString('en-GB'),
    t.type,
    t.influencer_name,
    t.amount.toLocaleString('en-US'),
    t.commission ? t.commission.toLocaleString('en-US') : '0',
    t.status,
    t.reference || '—'
  ])

  autoTable(doc, {
    startY: 45,
    head: headers,
    body: data,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY || 45

  // Summary
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text('Summary', 14, finalY + 10)
  
  doc.setFontSize(10)
  doc.text(`Total Revenue: NGN ${totalRevenue.toLocaleString('en-US')}`, 14, finalY + 18)
  doc.text(`Total Payouts: NGN ${totalPayouts.toLocaleString('en-US')}`, 14, finalY + 24)

  doc.save('moontrack-transactions-statement.pdf')
}

export function AdminReports() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const [filterType, setFilterType] = useState('all')
  const [searchInf, setSearchInf] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  async function loadData() {
    const [{ data: p }, { data: payouts }] = await Promise.all([
      supabase
        .from('payments')
        .select(
          'id, amount, commission_earned, payment_date, status, transaction_ref, influencers(full_name)'
        ),
      supabase
        .from('payouts')
        .select(
          'id, amount, payout_date, status, reference, influencers(full_name)'
        ),
    ])

    const allTransactions: Transaction[] = []

    if (p) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const pay of p as any[]) {
        const inf = Array.isArray(pay.influencers)
          ? pay.influencers[0]
          : pay.influencers
        allTransactions.push({
          id: `pay_${pay.id}`,
          date: pay.payment_date,
          type: 'Payment',
          influencer_name: inf?.full_name || '—',
          amount: pay.amount,
          commission: pay.commission_earned,
          status: pay.status,
          reference: pay.transaction_ref,
        })
      }
    }

    if (payouts) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const po of payouts as any[]) {
        const inf = Array.isArray(po.influencers)
          ? po.influencers[0]
          : po.influencers
        allTransactions.push({
          id: `po_${po.id}`,
          date: po.payout_date,
          type: 'Payout',
          influencer_name: inf?.full_name || '—',
          amount: po.amount,
          commission: null,
          status: po.status,
          reference: po.reference,
        })
      }
    }

    // Sort by date descending
    allTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setTransactions(allTransactions)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'all' && t.type.toLowerCase() !== filterType) return false
    if (searchInf && !t.influencer_name.toLowerCase().includes(searchInf.toLowerCase())) return false
    if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false
    
    // For dateTo, we want to include the whole day, so we compare against dateTo + 1 day or check if it's less than or equal.
    // A simpler way:
    if (dateTo && new Date(t.date) > new Date(dateTo + 'T23:59:59')) return false
    
    return true
  })

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Reports</h1>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <h2 className='text-lg font-medium'>Transactions Ledger</h2>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => exportToCSV(filteredTransactions)}
              disabled={loading || filteredTransactions.length === 0}
              variant='outline'
            >
              <IconDownload className='mr-2 size-4' />
              Download CSV
            </Button>
            <Button
              onClick={() => exportToPDF(filteredTransactions)}
              disabled={loading || filteredTransactions.length === 0}
              variant='default'
            >
              <IconFileTypePdf className='mr-2 size-4' />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className='mb-6'>
          <CardContent className='p-4'>
            <div className='grid gap-4 md:grid-cols-4'>
              <div>
                <Label className='mb-1 block text-xs'>Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder='All Types' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Types</SelectItem>
                    <SelectItem value='payment'>Payments</SelectItem>
                    <SelectItem value='payout'>Payouts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className='mb-1 block text-xs'>Influencer</Label>
                <Input
                  placeholder='Search name...'
                  value={searchInf}
                  onChange={(e) => setSearchInf(e.target.value)}
                />
              </div>
              <div>
                <Label className='mb-1 block text-xs'>From Date</Label>
                <Input
                  type='date'
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label className='mb-1 block text-xs'>To Date</Label>
                <Input
                  type='date'
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base font-semibold'>
              All Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            {loading ? (
              <div className='space-y-3 p-6'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className='h-10 w-full' />
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className='p-6 text-center text-muted-foreground'>
                No transactions found matching your filters.
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Influencer</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                      <TableHead className='text-right'>Commission</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className='flex items-center gap-1'>
                            {t.type === 'Payment' ? (
                              <IconTrendingUp className='size-4 text-green-500' />
                            ) : (
                              <IconTrendingDown className='size-4 text-orange-500' />
                            )}
                            <span className='font-medium'>{t.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{t.influencer_name}</TableCell>
                        <TableCell className='text-right font-semibold'>
                          {fmt(t.amount)}
                        </TableCell>
                        <TableCell className='text-right text-muted-foreground'>
                          {t.commission ? fmt(t.commission) : '—'}
                        </TableCell>
                        <TableCell className='font-mono text-xs text-muted-foreground'>
                          {t.reference ?? '—'}
                        </TableCell>
                        <TableCell className='text-xs whitespace-nowrap text-muted-foreground'>
                          {new Date(t.date).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell className='text-xs capitalize'>
                          {t.status}
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
