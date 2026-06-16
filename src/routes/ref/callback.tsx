import { useEffect, useState } from 'react'
import { z } from 'zod'
import { createFileRoute, useSearch, Link } from '@tanstack/react-router'
import {
  IconMoon,
  IconCircleCheck,
  IconCircleX,
  IconLoader2,
  IconClock,
} from '@tabler/icons-react'

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
  const { transaction_id, tx_ref, status } = useSearch({
    from: '/ref/callback',
  })
  const [verifying, setVerifying] = useState(true)
  const [result, setResult] = useState<'success' | 'pending' | 'failed' | null>(
    null
  )
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
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 bg-background'>
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
                Welcome to{' '}
                <span className='font-semibold text-foreground'>
                  {courseName}
                </span>
                . Your spot is secured.
              </p>
            </div>
            
            <div className='my-6 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-6'>
              <h2 className='mb-2 text-lg font-bold text-foreground'>
                Step 2: Join the Community
              </h2>
              <p className='mb-6 text-sm text-muted-foreground'>
                All class announcements, links, and support will be shared in our private WhatsApp group. Join now so you don't miss anything!
              </p>
              
              <div className='mb-6 hidden flex-col items-center justify-center gap-3 rounded-xl bg-white p-4 text-center sm:flex'>
                <img
                  src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fchat.whatsapp.com%2FJlvlDrhbhjvGCq4YO1RQCy%3Fs%3Dcl%26p%3Da%26mlu%3D4'
                  alt='WhatsApp QR Code'
                  className='size-32 object-contain'
                />
                <p className='text-xs font-semibold text-gray-600'>
                  Scan with your phone's camera
                </p>
              </div>

              <a
                href='https://chat.whatsapp.com/JlvlDrhbhjvGCq4YO1RQCy?s=cl&p=a&mlu=4'
                target='_blank'
                rel='noopener noreferrer'
                className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20bd5a]'
              >
                Join Private WhatsApp Group
              </a>
            </div>

            <p className='text-xs text-muted-foreground'>
              A receipt has also been sent to your email.
            </p>
          </>
        ) : result === 'pending' ? (
          <>
            <IconClock className='mx-auto size-16 text-yellow-500' />
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold'>Payment Processing</h1>
              <p className='text-muted-foreground'>
                Your bank transfer is being confirmed. This usually takes a few
                minutes.
              </p>
            </div>
            <div className='my-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-6 py-4 text-sm text-yellow-700 dark:text-yellow-400'>
              <p className='font-medium'>What happens next?</p>
              <p className='mt-1'>
                Once your transfer is confirmed, you'll receive a confirmation
                email. You don't need to stay on this page.
              </p>
            </div>

            <div className='mt-6 border-t pt-6'>
              <h2 className='mb-2 text-base font-bold text-foreground'>
                While you wait...
              </h2>
              <p className='mb-4 text-sm text-muted-foreground'>
                You can go ahead and join our private WhatsApp group now so you're ready when the class starts.
              </p>

              <div className='mb-4 hidden flex-col items-center justify-center gap-2 rounded-xl bg-white p-3 text-center sm:flex'>
                <img
                  src='https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fchat.whatsapp.com%2FJlvlDrhbhjvGCq4YO1RQCy%3Fs%3Dcl%26p%3Da%26mlu%3D4'
                  alt='WhatsApp QR Code'
                  className='size-24 object-contain'
                />
                <p className='text-[10px] font-semibold uppercase text-gray-500'>
                  Scan with your phone
                </p>
              </div>

              <a
                href='https://chat.whatsapp.com/JlvlDrhbhjvGCq4YO1RQCy?s=cl&p=a&mlu=4'
                target='_blank'
                rel='noopener noreferrer'
                className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-[#20bd5a]'
              >
                Join WhatsApp Group
              </a>
            </div>
          </>
        ) : (
          <>
            <IconCircleX className='mx-auto size-16 text-destructive' />
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold'>Payment Failed</h1>
              <p className='text-muted-foreground'>
                Something went wrong with your payment. Please try again or
                contact support.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
