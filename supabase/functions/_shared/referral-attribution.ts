import { normalizeReferralCode } from './referral-code.ts'

export type ResolvedReferral = {
  influencerId: string
  refCode: string
  isActive: boolean
  source: 'referral_links' | 'influencers'
}

export function extractReferralCodeFromTxRef(rawTxRef: unknown): string | null {
  if (typeof rawTxRef !== 'string') return null

  const txRef = rawTxRef.trim()
  const match = txRef.match(/^MTL-(.+)-\d+$/)
  return match?.[1]?.trim() || null
}

export async function resolveReferralAttribution(
  supabase: any,
  rawRefCode: unknown
): Promise<ResolvedReferral | null> {
  if (typeof rawRefCode !== 'string') return null

  const refCode = rawRefCode.trim()
  if (!refCode) return null
  const normalizedRefCode = normalizeReferralCode(refCode)

  const candidateCodes = [...new Set([refCode, normalizedRefCode].filter(Boolean))]

  for (const candidateCode of candidateCodes) {
    const { data: link, error: linkError } = await supabase
      .from('referral_links')
      .select('influencer_id, ref_code, is_active')
      .eq('ref_code', candidateCode)
      .maybeSingle()

    if (linkError) {
      console.error('Error looking up referral link:', linkError)
    }

    if (link?.influencer_id) {
      return {
        influencerId: link.influencer_id,
        refCode: link.ref_code ?? candidateCode,
        isActive: link.is_active ?? true,
        source: 'referral_links',
      }
    }

    const { data: influencer, error: influencerError } = await supabase
      .from('influencers')
      .select('id, ref_code, is_active')
      .eq('ref_code', candidateCode)
      .maybeSingle()

    if (influencerError) {
      console.error('Error looking up influencer ref_code:', influencerError)
    }

    if (influencer?.id) {
      return {
        influencerId: influencer.id,
        refCode: influencer.ref_code ?? candidateCode,
        isActive: influencer.is_active ?? true,
        source: 'influencers',
      }
    }
  }

  return null
}
