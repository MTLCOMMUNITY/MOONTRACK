import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Loader2 as IconLoader2,
  AlertCircle as IconAlertCircle,
  Play as IconPlay,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useReferral } from '@/hooks/useReferral'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

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
          course_fee:
            settingsData.find((s) => s.key === 'course_fee')?.value ?? '50000',
          course_name:
            settingsData.find((s) => s.key === 'course_name')?.value ??
            'MoonTech Life Program',
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
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
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
            <img
              src='/moon-logo.png'
              alt='MoonTech Life Logo'
              className='size-12 object-contain'
            />
          </div>
          <h1 className='text-2xl font-bold tracking-tight'>MoonTech Life</h1>
          {settings ? (
            <p className='text-sm text-muted-foreground'>
              {settings.course_name}
            </p>
          ) : (
            <Skeleton className='mx-auto h-4 w-48' />
          )}
        </div>

        {/* Referral Status */}
        {refCode === null ? (
          <div className='flex items-start gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-600 dark:text-yellow-500'>
            <IconAlertCircle className='mt-0.5 size-5 shrink-0' />
            <p>
              <strong>Invite required:</strong> You must have a valid referral
              invite link to join the program. Please click your invite link to
              proceed.
            </p>
          </div>
        ) : (
          <div className='flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-500'>
            <div className='size-2 animate-pulse rounded-full bg-green-500' />
            <p>
              Referral Code Applied:{' '}
              <strong className='font-mono'>{refCode}</strong>
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

        {/* Watch How to Pay Video */}
        {refCode && (
          <div className='flex justify-center'>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex h-9 items-center justify-center gap-2 border-dashed border-red-500/70 px-4 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-500/5 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10'
                >
                  <IconPlay className='size-3.5 fill-current' />
                  Need help? Watch how to pay (1-min video)
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-xl'>
                <DialogHeader>
                  <DialogTitle>How to Pay</DialogTitle>
                  <DialogDescription>
                    Watch this short video guide showing you how to make a
                    payment.
                  </DialogDescription>
                </DialogHeader>
                <div className='aspect-video overflow-hidden rounded-lg border bg-muted'>
                  <iframe
                    src='https://www.youtube.com/embed/Fr4XlnpLuwk?si=DmErxPPa3tka8_UP'
                    title='How to Pay Guide'
                    className='h-full w-full'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    referrerPolicy='strict-origin-when-cross-origin'
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

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
              <>
                <IconLoader2 className='me-2 size-4 animate-spin' />
                Redirecting to payment…
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </form>

        {refCode && (
          <div className='space-y-2 text-center'>
            <p className='text-xs text-muted-foreground'>
              Secured by Flutterwave
            </p>
            <p className='mx-auto max-w-xs text-[10px] leading-relaxed text-muted-foreground/80'>
              💡 <strong>Note on Bank Transfers:</strong> If your bank delays
              processing the transfer, you can safely close this page. The
              system will automatically confirm your registration in the
              background as soon as your bank settles the payment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
