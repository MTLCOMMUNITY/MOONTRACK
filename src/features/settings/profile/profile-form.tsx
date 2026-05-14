import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Profile = {
  full_name: string
  email: string
  ref_code: string
  commission_rate: number
}

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('influencers')
        .select('full_name, email, ref_code, commission_rate')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfile(data as Profile)
        setFullName(data.full_name)
      } else {
        // Fallback: show auth email even if influencer row doesn't exist yet
        setProfile({
          full_name: user.user_metadata?.full_name ?? '',
          email: user.email ?? '',
          ref_code: '—',
          commission_rate: 0,
        })
        setFullName(user.user_metadata?.full_name ?? '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!profile) return
    setSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('influencers')
      .update({ full_name: fullName })
      .eq('user_id', user.id)

    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated')
      setProfile((p) => (p ? { ...p, full_name: fullName } : p))
    }
    setSaving(false)
  }

  return (
    <div className='w-full space-y-6'>
      {/* Display Name */}
      <div className='space-y-2'>
        <Label htmlFor='full-name'>Display Name</Label>
        {loading ? (
          <Skeleton className='h-9 w-full' />
        ) : (
          <Input
            id='full-name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder='Your full name'
          />
        )}
        <p className='text-xs text-muted-foreground'>
          This is the name shown in the sidebar and profile dropdown.
        </p>
      </div>

      {/* Email — read only */}
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        {loading ? (
          <Skeleton className='h-9 w-full' />
        ) : (
          <Input
            id='email'
            value={profile?.email ?? ''}
            disabled
            className='cursor-not-allowed opacity-60'
          />
        )}
        <p className='text-xs text-muted-foreground'>
          Email is managed by MoonTech Life admin and cannot be changed here.
        </p>
      </div>

      <Button onClick={handleSave} disabled={saving || loading}>
        {saving ? 'Saving…' : 'Update profile'}
      </Button>

      <Separator />

      {/* Affiliate Info — read only */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-semibold'>
            Affiliate Details
          </CardTitle>
          <CardDescription className='text-xs'>
            Managed by MoonTech Life admin. Contact support to request changes.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1'>
            <p className='text-xs text-muted-foreground'>Referral Code</p>
            {loading ? (
              <Skeleton className='h-6 w-28' />
            ) : (
              <p className='font-mono text-sm font-semibold'>
                {profile?.ref_code ?? '—'}
              </p>
            )}
          </div>
          <div className='space-y-1'>
            <p className='text-xs text-muted-foreground'>Commission Rate</p>
            {loading ? (
              <Skeleton className='h-6 w-16' />
            ) : (
              <p className='text-sm font-semibold'>
                {profile?.commission_rate ?? 0}%
              </p>
            )}
          </div>
          <div className='space-y-1 sm:col-span-2'>
            <p className='text-xs text-muted-foreground'>Your Referral Link</p>
            {loading ? (
              <Skeleton className='h-6 w-full' />
            ) : (
              <p className='break-all font-mono text-xs text-muted-foreground'>
                https://moontechlife.com/register?ref={profile?.ref_code ?? '—'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
