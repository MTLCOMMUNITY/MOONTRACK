import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { IconMoon, IconCircleCheck, IconCircleX, IconLoader2 } from '@tabler/icons-react'
import { z } from 'zod'

const searchSchema = z.object({
  transaction_id: z.string().optional(),
  tx_ref: z.string().optional(),
  status: z.string().optional(),
})

export const Route = createFileRoute('/ref/callback')({
  validateSearch: searchSchema,
  component: CallbackPage,
})

function CallbackPage() {
  const { transaction_id, tx_ref, status } = useSearch({ from: '/ref/callback' })
  const [verifying, setVerifying] = useState(true)
  const [result, setResult] = useState<'success' | 'failed' | null>(null)
  const [courseName, setCourseName] = useState('MoonTech Life Program')

  useEffect(() => {
    async function verify() {
      if (!transaction_id || status !== 'successful') {
        setResult('failed')
        setVerifying(false)
        return
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transaction_id, tx_ref }),
          }
        )
        const data = await res.json()
        setResult(data.ok ? 'success' : 'failed')
        if (data.course_name) setCourseName(data.course_name)
      } catch {
        setResult('failed')
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
