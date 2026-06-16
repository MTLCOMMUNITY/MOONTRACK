import { useState, useCallback } from 'react'
import { normalizeReferralCode } from '@/lib/referral-code'

const STORAGE_KEY = 'moontrack_ref_code'

export function useReferral() {
  const [refCode, setRefCode] = useState<string | null>(() => {
    // Read from local storage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? normalizeReferralCode(stored) : null
    }
    return null
  })

  const saveRefCode = useCallback((code: string) => {
    const normalized = normalizeReferralCode(code)
    localStorage.setItem(STORAGE_KEY, normalized)
    setRefCode(normalized)
  }, [])

  const clearRefCode = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setRefCode(null)
  }, [])

  return { refCode, saveRefCode, clearRefCode }
}
