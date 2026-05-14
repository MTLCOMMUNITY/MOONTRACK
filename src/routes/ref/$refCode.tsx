import { createFileRoute, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { IconMoon, IconLoader2 } from '@tabler/icons-react'

export const Route = createFileRoute('/ref/$refCode')({
  component: ReferralPage,
})

type Settings = { course_fee: string; course_name: string }

function ReferralPage() {
  const { refCode } = useParams({ from: '/ref/$refCode' })


  const [settings, setSettings] = useState<Settings | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function init() {
      // Track click
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref_code: refCode }),
      }).catch(() => {})

      // Validate ref code
      const { data: link } = await supabase
        .from('referral_links')
        .select('id')
        .eq('ref_code', refCode)
        .eq('is_active', true)
        .single()

      setValid(!!link)

      // Load course settings
      const { data: settingsData } = await supabase
        .from('app_settings')
        .select('key, value')

      if (settingsData) {
        setSettings({
          course_fee: settingsData.find((s) => s.key === 'course_fee')?.value ?? '50000',
          course_name: settingsData.find((s) => s.key === 'course_name')?.value ?? 'MoonTech Life Program',
        })
      }
    }
    init()
  }, [refCode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all fields')
      return
    }

    setSubmitting(true)

    // Call Edge Function to create Flutterwave payment link
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ref_code: refCode,
            name,
            email,
            phone,
            amount: settings?.course_fee ?? '50000',
            course_name: settings?.course_name ?? 'MoonTech Life Program',
          }),
        }
      )
      const data = await res.json()
      if (data.payment_link) {
        window.location.href = data.payment_link
      } else {
        setError(data.error ?? 'Could not initiate payment. Please try again.')
        setSubmitting(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  // Invalid ref code
  if (valid === false) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center'>
        <IconMoon className='mb-4 size-10 text-muted-foreground' />
        <h1 className='text-xl font-bold'>Link Not Found</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          This referral link is invalid or no longer active.
        </p>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12'>
      <div className='w-full max-w-md space-y-6'>
        {/* Header */}
        <div className='space-y-1 text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
              <IconMoon className='size-6' />
            </div>
          </div>
          <h1 className='text-2xl font-bold tracking-tight'>MoonTech Life</h1>
          {settings ? (
            <p className='text-sm text-muted-foreground'>{settings.course_name}</p>
          ) : (
            <Skeleton className='mx-auto h-4 w-48' />
          )}
        </div>

        {/* Price */}
        <div className='rounded-lg border bg-muted/40 px-6 py-4 text-center'>
          {settings ? (
            <>
              <p className='text-xs text-muted-foreground'>Course Fee</p>
              <p className='mt-1 text-3xl font-bold'>
                ₦{parseInt(settings.course_fee).toLocaleString()}
              </p>
            </>
          ) : (
            <Skeleton className='mx-auto h-8 w-32' />
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='student-name'>Full Name</Label>
            <Input
              id='student-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='John Doe'
              required
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='student-email'>Email Address</Label>
            <Input
              id='student-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='john@example.com'
              required
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='student-phone'>Phone Number</Label>
            <Input
              id='student-phone'
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='+234 800 000 0000'
              required
            />
          </div>

          {error && (
            <p className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'>
              {error}
            </p>
          )}

          <Button
            type='submit'
            className='w-full'
            disabled={submitting || !settings}
          >
            {submitting ? (
              <><IconLoader2 className='me-2 size-4 animate-spin' />Redirecting to payment…</>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </form>

        <p className='text-center text-xs text-muted-foreground'>
          Secured by Flutterwave · Ref: {refCode}
        </p>
      </div>
    </div>
  )
}
