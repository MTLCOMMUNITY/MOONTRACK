import { useState } from 'react'

const STORAGE_KEY = 'moontrack_ref_code'

export function useReferral() {
  const [refCode, setRefCode] = useState<string | null>(() => {
    // Read from local storage on mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY)
    }
    return null
  })

  const saveRefCode = (code: string) => {
    localStorage.setItem(STORAGE_KEY, code)
    setRefCode(code)
  }

  const clearRefCode = () => {
    localStorage.removeItem(STORAGE_KEY)
    setRefCode(null)
  }

  return { refCode, saveRefCode, clearRefCode }
}
