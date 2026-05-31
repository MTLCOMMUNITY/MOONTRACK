import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useReferral } from '@/hooks/useReferral'
import { IconMoon, IconLoader2 } from '@tabler/icons-react'

export const Route = createFileRoute('/ref/$refCode')({
  component: ReferralTracker,
})

function ReferralTracker() {
  const { refCode } = useParams({ from: '/ref/$refCode' })
  const navigate = useNavigate({ from: '/ref/$refCode' })
  const { saveRefCode } = useReferral()
  const [error, setError] = useState(false)

  useEffect(() => {
    async function init() {
      // Track click
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-click`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ ref_code: refCode }),
      }).catch(() => {})

      // Validate ref code
      const { data: link } = await supabase
        .from('referral_links')
        .select('id')
        .eq('ref_code', refCode)
        .eq('is_active', true)
        .single()

      if (link) {
        saveRefCode(refCode)
        // Redirect to the new internal sales page.
        // The refCode is already saved in localStorage for this domain.
        window.location.href = '/ai-website-bootcamp'
      } else {
        setError(true)
      }
    }
    init()
  }, [refCode, navigate, saveRefCode])

  if (error) {
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
    <div className='flex min-h-screen flex-col items-center justify-center bg-background gap-4'>
      <IconLoader2 className='size-10 animate-spin text-primary' />
      <p className='text-sm text-muted-foreground'>Applying your invite code...</p>
    </div>
  )
}
