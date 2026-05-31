import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export function AdminSettings() {
  const [courseFee, setCourseFee] = useState('')
  const [courseName, setCourseName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
      if (data) {
        const fee = data.find((r) => r.key === 'course_fee')?.value ?? ''
        const name = data.find((r) => r.key === 'course_name')?.value ?? ''
        setCourseFee(fee)
        setCourseName(name)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!courseFee || !courseName) {
      toast.error('Please fill in all fields')
      return
    }
    setSaving(true)
    const updates = [
      supabase.from('app_settings').upsert({ key: 'course_fee', value: courseFee }),
      supabase.from('app_settings').upsert({ key: 'course_name', value: courseName }),
    ]
    const results = await Promise.all(updates)
    const hasError = results.some((r) => r.error)
    if (hasError) {
      toast.error('Failed to save settings')
    } else {
      toast.success('Settings saved')
    }
    setSaving(false)
  }

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold tracking-tight'>Settings</h1>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base font-semibold'>Course Settings</CardTitle>
              <CardDescription>
                These values are used on the public payment page shown to students.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div className='space-y-1.5'>
                <Label htmlFor='course-name'>Course Name</Label>
                {loading ? (
                  <Skeleton className='h-9 w-full' />
                ) : (
                  <Input
                    id='course-name'
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder='MoonTech Life Digital Skills Program'
                  />
                )}
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='course-fee'>Course Fee (₦)</Label>
                {loading ? (
                  <Skeleton className='h-9 w-48' />
                ) : (
                  <Input
                    id='course-fee'
                    type='number'
                    value={courseFee}
                    onChange={(e) => setCourseFee(e.target.value)}
                    placeholder='50000'
                    min='0'
                  />
                )}
                <p className='text-xs text-muted-foreground'>
                  Amount students pay when they click a referral link
                </p>
              </div>
              <Separator />
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? 'Saving…' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base font-semibold'>Payment Integration</CardTitle>
              <CardDescription>
                Public frontend vars belong in Vercel. Edge Function secrets belong in Supabase project secrets.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {[
                { label: 'Public Key', env: 'VITE_FLW_PUBLIC_KEY' },
                { label: 'Secret Key (Edge Function)', env: 'FLW_SECRET_KEY' },
                { label: 'Webhook Secret', env: 'FLW_WEBHOOK_SECRET' },
              ].map(({ label, env }) => (
                <div key={env} className='flex items-center justify-between rounded-md border px-4 py-2.5'>
                  <div>
                    <p className='text-sm font-medium'>{label}</p>
                    <p className='font-mono text-xs text-muted-foreground'>{env}</p>
                  </div>
                  <span className='text-xs text-muted-foreground'>env var</span>
                </div>
              ))}
              <p className='pt-1 text-xs text-muted-foreground'>
                Set `VITE_*` vars in Vercel and server-only `FLW_*` vars in Supabase Edge Function secrets.
              </p>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
