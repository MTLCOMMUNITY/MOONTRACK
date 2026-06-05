import { useState, useCallback } from 'react'

const STORAGE_KEY = 'moontrack_ref_code'

export function useReferral() {
  const [refCode, setRefCode] = useState<string | null>(() => {
    // Read from local storage on mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY)
    }
    return null
  })

  const saveRefCode = useCallback((code: string) => {
    localStorage.setItem(STORAGE_KEY, code)
    setRefCode(code)
  }, [])

  const clearRefCode = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setRefCode(null)
  }, [])

  return { refCode, saveRefCode, clearRefCode }
}
