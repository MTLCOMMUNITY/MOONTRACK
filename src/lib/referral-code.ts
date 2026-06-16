export function normalizeReferralCode(value: string) {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .replace(/-{2,}/g, '-')
}

export function isValidReferralCode(value: string) {
  return /^[A-Za-z0-9_-]{1,64}$/.test(value)
}
