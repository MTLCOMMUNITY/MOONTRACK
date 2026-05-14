import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type WeeklyPoint = {
  name: string
  clicks: number
  conversions: number
}

export type AnalyticsData = {
  totalClicks: number
  conversionRate: number
  avgCommission: number
  activeLinks: number
  weeklyChart: WeeklyPoint[]
  topLinks: { name: string; value: number }[]
  statusBreakdown: { name: string; value: number }[]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfDayUTC(date: Date) {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalClicks: 0,
    conversionRate: 0,
    avgCommission: 0,
    activeLinks: 0,
    weeklyChart: DAY_LABELS.map((name) => ({ name, clicks: 0, conversions: 0 })),
    topLinks: [],
    statusBreakdown: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        // ── Referral links ─────────────────────────────────
        const { data: links } = await supabase
          .from('referral_links')
          .select('ref_code, click_count, is_active')

        const totalClicks =
          links?.reduce((s, l) => s + (l.click_count ?? 0), 0) ?? 0
        const activeLinks =
          links?.filter((l) => l.is_active).length ?? 0

        // ── Conversions ────────────────────────────────────
        const { data: conversions } = await supabase
          .from('conversions')
          .select('id, ref_code, registered_at')

        const totalConversions = conversions?.length ?? 0
        const conversionRate =
          totalClicks > 0
            ? Math.round((totalConversions / totalClicks) * 100 * 10) / 10
            : 0

        // ── Weekly chart — last 7 days ─────────────────────
        const now = new Date()
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Build ordered day labels for the last 7 days
        const dayEntries: WeeklyPoint[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
          return { name: DAY_LABELS[d.getDay()], clicks: 0, conversions: 0 }
        })

        // Count conversions per day slot
        conversions
          ?.filter((c) => new Date(c.registered_at) >= sevenDaysAgo)
          .forEach((c) => {
            const cDate = startOfDayUTC(new Date(c.registered_at))
            const idx = dayEntries.findIndex((_, i) => {
              const slotDate = startOfDayUTC(
                new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
              )
              return slotDate.toDateString() === cDate.toDateString()
            })
            if (idx !== -1) dayEntries[idx].conversions += 1
          })

        // Spread total clicks proportionally across days (best available without daily tracking)
        const totalDayConv = dayEntries.reduce((s, d) => s + d.conversions, 1)
        dayEntries.forEach((d) => {
          d.clicks = Math.round(
            (d.conversions / totalDayConv) * totalClicks || 0
          )
        })

        // ── Top links by conversion count ──────────────────
        const linkConvMap: Record<string, number> = {}
        conversions?.forEach((c) => {
          linkConvMap[c.ref_code] = (linkConvMap[c.ref_code] ?? 0) + 1
        })
        const topLinks = Object.entries(linkConvMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([name, value]) => ({ name, value }))

        // ── Payments ────────────────────────────────────────
        const { data: payments } = await supabase
          .from('payments')
          .select('commission_earned, status')

        const confirmed = payments?.filter((p) => p.status === 'confirmed') ?? []
        const avgCommission =
          confirmed.length > 0
            ? Math.round(
                confirmed.reduce(
                  (s, p) => s + (p.commission_earned ?? 0),
                  0
                ) / confirmed.length
              )
            : 0

        // Status breakdown as percentages
        const total = payments?.length ?? 0
        const countOf = (s: string) =>
          payments?.filter((p) => p.status === s).length ?? 0
        const pct = (n: number) =>
          total > 0 ? Math.round((n / total) * 100) : 0

        const statusBreakdown = [
          { name: 'Confirmed', value: pct(countOf('confirmed')) },
          { name: 'Pending', value: pct(countOf('pending')) },
          { name: 'Reversed', value: pct(countOf('reversed')) },
        ]

        setData({
          totalClicks,
          conversionRate,
          avgCommission,
          activeLinks,
          weeklyChart: dayEntries,
          topLinks: topLinks.length > 0 ? topLinks : [],
          statusBreakdown,
        })
      } catch (_) {
        // silently keep empty state on error
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  return { data, loading }
}
