import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeeklyPoint } from '@/hooks/use-analytics'

interface AnalyticsChartProps {
  data: WeeklyPoint[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
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
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6 }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Area
          type='monotone'
          dataKey='clicks'
          name='Clicks'
          stroke='#2563eb'
          className='text-primary'
          fill='#2563eb'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='conversions'
          name='Conversions'
          stroke='#10b981'
          className='text-muted-foreground'
          fill='#10b981'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
