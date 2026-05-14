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
      // Fetch referral links
      const { data: linkData, error: linkError } = await supabase
        .from('referral_links')
        .select('id, ref_code, target_url, click_count, is_active')
        .order('click_count', { ascending: false })

      if (linkError) {
        setError(linkError.message)
        setLoading(false)
        return
      }

      // For each link, count conversions by ref_code
      const linksWithCounts = await Promise.all(
        (linkData ?? []).map(async (link) => {
          const { count } = await supabase
            .from('conversions')
            .select('id', { count: 'exact', head: true })
            .eq('ref_code', link.ref_code)

          return { ...link, conversion_count: count ?? 0 }
        })
      )

      setLinks(linksWithCounts)
      setLoading(false)
    }

    fetchLinks()
  }, [])

  return { links, loading, error }
}
