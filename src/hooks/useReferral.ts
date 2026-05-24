import { useState, useEffect } from 'react'

const STORAGE_KEY = 'moontrack_ref_code'

export function useReferral() {
  const [refCode, setRefCode] = useState<string | null>(null)

  useEffect(() => {
    // Read from local storage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setRefCode(stored)
    }
  }, [])

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
