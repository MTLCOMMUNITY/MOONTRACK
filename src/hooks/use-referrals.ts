import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type ReferralLink = {
  id: string
  ref_code: string
  target_url: string
  click_count: number
  is_active: boolean
  conversion_count?: number
}

export function useReferrals() {
  const [links, setLinks] = useState<ReferralLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLinks() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      const { data: influencer } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!influencer) {
        setLoading(false)
        return
      }

      // Fetch referral links and conversions concurrently
      const [
        { data: linkData, error: linkError },
        { data: convData }
      ] = await Promise.all([
        supabase
          .from('referral_links')
          .select('id, ref_code, target_url, click_count, is_active')
          .eq('influencer_id', influencer.id)
          .order('click_count', { ascending: false }),
        supabase
          .from('conversions')
          .select('ref_code')
          .eq('influencer_id', influencer.id)
      ])

      if (linkError) {
        setError(linkError.message)
        setLoading(false)
        return
      }

      // Group conversions by ref_code
      const convCounts = (convData ?? []).reduce((acc, row) => {
        if (row.ref_code) {
          acc[row.ref_code] = (acc[row.ref_code] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)

      // Attach conversion_count to each link
      const linksWithCounts = (linkData ?? []).map(link => ({
        ...link,
        conversion_count: convCounts[link.ref_code] || 0
      }))

      setLinks(linksWithCounts)
      setLoading(false)
    }

    fetchLinks()
  }, [])

  return { links, loading, error }
}
