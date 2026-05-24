import { createFileRoute, useSearch, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { IconMoon, IconCircleCheck, IconCircleX, IconLoader2, IconClock } from '@tabler/icons-react'
import { z } from 'zod'

const searchSchema = z.object({
  transaction_id: z.coerce.string().optional(),
  tx_ref: z.coerce.string().optional(),
  status: z.coerce.string().optional(),
})

export const Route = createFileRoute('/ref/callback')({
  validateSearch: searchSchema,
  component: CallbackPage,
})

function CallbackPage() {
  const { transaction_id, tx_ref, status } = useSearch({ from: '/ref/callback' })
  const [verifying, setVerifying] = useState(true)
  const [result, setResult] = useState<'success' | 'pending' | 'failed' | null>(null)
  const [courseName, setCourseName] = useState('MoonTech Life Program')

  useEffect(() => {
    async function verify() {
      // No transaction_id at all — definitely failed
      if (!transaction_id) {
        setResult('failed')
        setVerifying(false)
        return
      }

      // Bank transfer redirects with status=pending — payment is processing,
      // not failed. Try to verify anyway (webhook may have already settled it).
      const isPending = status === 'pending'
      const isConfirmed = status === 'successful' || status === 'completed'

      if (!isPending && !isConfirmed) {
        setResult('failed')
        setVerifying(false)
        return
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ transaction_id, tx_ref }),
          }
        )
        const data = await res.json()

        if (data.ok) {
          setResult('success')
          if (data.course_name) setCourseName(data.course_name)
        } else if (isPending) {
          // Bank transfer is still processing — not a failure, just not settled yet.
          // The webhook will record it once the bank confirms.
          setResult('pending')
        } else {
          setResult('failed')
        }
      } catch {
        // Network error during verify — if it was a bank transfer, show pending
        // rather than a false "failed" message.
        setResult(isPending ? 'pending' : 'failed')
      } finally {
        setVerifying(false)
      }
    }

    verify()
  }, [transaction_id, tx_ref, status])

  if (verifying) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-background gap-4'>
        <IconLoader2 className='size-10 animate-spin text-primary' />
        <p className='text-sm text-muted-foreground'>Verifying your payment…</p>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12'>
      <div className='w-full max-w-md space-y-6 text-center'>
        <div className='flex justify-center'>
          <div className='flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
            <IconMoon className='size-6' />
          </div>
        </div>

        {result === 'success' ? (
          <>
            <IconCircleCheck className='mx-auto size-16 text-green-500' />
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold'>Payment Successful!</h1>
              <p className='text-muted-foreground'>
                Welcome to <span className='font-semibold text-foreground'>{courseName}</span>.
                You'll receive a confirmation email shortly.
              </p>
            </div>
            <div className='rounded-lg border bg-muted/40 px-6 py-4 text-sm text-muted-foreground'>
              Keep an eye on your inbox. Our team will reach out with your onboarding details.
            </div>
            <Link 
              to="/ai-website-bootcamp" 
              className="mt-4 block text-center font-semibold text-blue-500 hover:underline"
            >
              Click here to go back to the Bootcamp Information
            </Link>
          </>
        ) : result === 'pending' ? (
          <>
            <IconClock className='mx-auto size-16 text-yellow-500' />
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold'>Payment Processing</h1>
              <p className='text-muted-foreground'>
                Your bank transfer is being confirmed. This usually takes a few minutes.
              </p>
            </div>
            <div className='rounded-lg border bg-yellow-500/10 border-yellow-500/30 px-6 py-4 text-sm text-yellow-700 dark:text-yellow-400'>
              <p className='font-medium'>What happens next?</p>
              <p className='mt-1'>
                Once your transfer is confirmed, you'll receive a confirmation email. You don't need
                to stay on this page.
              </p>
            </div>
          </>
        ) : (
          <>
            <IconCircleX className='mx-auto size-16 text-destructive' />
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold'>Payment Failed</h1>
              <p className='text-muted-foreground'>
                Something went wrong with your payment. Please try again or contact support.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
