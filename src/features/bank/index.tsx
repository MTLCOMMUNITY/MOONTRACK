import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export function Bank() {
  const { id: userId } = useCurrentUser()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  useEffect(() => {
    async function loadProfile() {
      if (!userId) return
      const { data } = await supabase
        .from('influencers')
        .select('bank_name, account_number, account_name')
        .eq('user_id', userId)
        .single()

      if (data) {
        setBankName(data.bank_name || '')
        setAccountNumber(data.account_number || '')
        setAccountName(data.account_name || '')
      }
      setLoading(false)
    }

    loadProfile()
  }, [userId])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return

    setSubmitting(true)
    const { error } = await supabase
      .from('influencers')
      .update({
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
      })
      .eq('user_id', userId)

    setSubmitting(false)

    if (error) {
      toast.error('Failed to update bank details: ' + error.message)
    } else {
      toast.success('Bank details updated successfully!')
    }
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-semibold tracking-tight'>Bank Details</h1>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        {loading ? (
          <Card className='w-full max-w-2xl'>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Loading your information...</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card className='w-full max-w-2xl'>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>
                Provide your bank account details for commission payouts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='bank-name'>Bank Name</Label>
                  <Input
                    id='bank-name'
                    placeholder='e.g., GTBank, Access Bank'
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='account-number'>Account Number</Label>
                  <Input
                    id='account-number'
                    placeholder='e.g., 0123456789'
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='account-name'>Account Name</Label>
                  <Input
                    id='account-name'
                    placeholder='e.g., John Doe'
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>

                <Button type='submit' disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Bank Details'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}
