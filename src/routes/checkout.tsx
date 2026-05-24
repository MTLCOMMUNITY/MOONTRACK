import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useReferral } from '@/hooks/useReferral'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { IconMoon, IconLoader2, IconAlertCircle } from '@tabler/icons-react'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

type Settings = { course_fee: string; course_name: string }

function CheckoutPage() {
  const { refCode } = useReferral()
  
  const [settings, setSettings] = useState<Settings | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function init() {
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
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!refCode) {
      setError('An invite link is required to join this program.')
      return
    }

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
            ref_code: refCode, // This is pulled from LocalStorage securely!
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

        {/* Missing Ref Code Warning */}
        {refCode === null && (
          <div className='flex items-start gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-600 dark:text-yellow-500'>
            <IconAlertCircle className='mt-0.5 size-5 shrink-0' />
            <p>
              <strong>Invite required:</strong> You must have a valid referral invite link to join the program. Please click your invite link to proceed.
            </p>
          </div>
        )}

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
              disabled={!refCode}
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
              disabled={!refCode}
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
              disabled={!refCode}
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
            disabled={submitting || !settings || !refCode}
          >
            {submitting ? (
              <><IconLoader2 className='me-2 size-4 animate-spin' />Redirecting to payment…</>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </form>

        {refCode && (
          <p className='text-center text-xs text-muted-foreground'>
            Secured by Flutterwave
          </p>
        )}
      </div>
    </div>
  )
}
