import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { supabase } from '@/lib/supabase'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function Overview() {
  const [data, setData] = useState(MONTHS.map((name) => ({ name, total: 0 })))

  useEffect(() => {
    async function load() {
      const year = new Date().getFullYear()
      const start = `${year}-01-01`
      const end = `${year}-12-31`

      const { data: payments } = await supabase
        .from('payments')
        .select('commission_earned, payment_date')
        .eq('status', 'confirmed')
        .gte('payment_date', start)
        .lte('payment_date', end)

      if (!payments) return

      const monthly = MONTHS.map((name) => ({ name, total: 0 }))
      payments.forEach((p) => {
        const month = new Date(p.payment_date).getMonth() // 0-11
        // eslint-disable-next-line security/detect-object-injection
        monthly[month].total += p.commission_earned ?? 0
      })

      setData(monthly)
    }
    load()
  }, [])

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v) =>
            typeof v === 'number'
              ? new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0,
                }).format(v)
              : v
          }
          contentStyle={{ fontSize: 12, borderRadius: 6 }}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
