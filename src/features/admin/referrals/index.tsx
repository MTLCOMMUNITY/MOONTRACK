import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

type ReferralLink = {
  id: string
  ref_code: string
  target_url: string
  click_count: number
  is_active: boolean
  influencer_id: string
  influencers: { full_name: string } | null
  conversion_count?: number
}

type InfluencerOption = {
  id: string
  full_name: string
}

export function AdminReferrals() {
  const [links, setLinks] = useState<ReferralLink[]>([])
  const [influencers, setInfluencers] = useState<InfluencerOption[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [selectedInfluencer, setSelectedInfluencer] = useState('')
  const [refCode, setRefCode] = useState('')
  const [targetUrl] = useState('https://moontechlife.com/register')

  async function load() {
    setLoading(true)
    try {
      // Fetch all links
      const { data: linkData, error } = await supabase
        .from('referral_links')
        .select(
          'id, ref_code, target_url, click_count, is_active, influencer_id, influencers(full_name)'
        )
        .order('click_count', { ascending: false })

      if (error) throw error

      // Fetch conversion count for each link
      const linksWithCounts = await Promise.all(
        (linkData ?? []).map(async (link) => {
          const { count } = await supabase
            .from('conversions')
            .select('id', { count: 'exact', head: true })
            .eq('ref_code', link.ref_code)

          return { ...link, conversion_count: count ?? 0 }
        })
      )
      setLinks(linksWithCounts as unknown as ReferralLink[])

      // Fetch influencers for the dropdown
      const { data: infData } = await supabase
        .from('influencers')
        .select('id, full_name')
        .order('full_name', { ascending: true })

      if (infData) {
        setInfluencers(infData as InfluencerOption[])
      }
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to load referral links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedInfluencer || !refCode || !targetUrl) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      // Check if ref code already exists
      const { data: existingLink } = await supabase
        .from('referral_links')
        .select('id')
        .eq('ref_code', refCode)
        .maybeSingle()

      if (existingLink) {
        toast.error(
          'This referral code is already in use by another influencer.'
        )
        return
      }

      const { error } = await supabase.from('referral_links').insert({
        influencer_id: selectedInfluencer,
        ref_code: refCode,
        target_url: targetUrl,
        is_active: true,
      })

      if (error) throw error

      toast.success('Referral link created successfully')
      setOpen(false)
      setRefCode('')
      load()
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to create link')
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('referral_links')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      toast.success(
        `Link has been ${!currentStatus ? 'activated' : 'deactivated'}`
      )
      load()
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to update link status')
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    const id = deleteId
    setDeleteId(null)
    try {
      const { error } = await supabase.from('referral_links').delete().eq('id', id)
      if (error) throw error
      toast.success('Referral link deleted')
      setLinks((prev) => prev.filter((link) => link.id !== id))
    } catch (err) {
      const error = err as Error
      toast.error(error.message ?? 'Failed to delete referral link')
    }
  }

  return (
    <>
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Referral Links
            </h1>
            <p className='text-muted-foreground'>
              Manage influencer referral links and track click performance.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Create Link
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Create Referral Link</DialogTitle>
                <DialogDescription>
                  Generate a new referral link for an influencer. This will not
                  affect their previous stats.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className='space-y-4 pt-4'>
                <div className='space-y-2'>
                  <Label>Influencer</Label>
                  <Select
                    value={selectedInfluencer}
                    onValueChange={setSelectedInfluencer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select an influencer' />
                    </SelectTrigger>
                    <SelectContent>
                      {influencers.map((inf) => (
                        <SelectItem key={inf.id} value={inf.id}>
                          {inf.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='refCode'>Referral Code</Label>
                  <Input
                    id='refCode'
                    placeholder='e.g., john-doe-2024'
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                  />
                  <p className='text-xs text-muted-foreground'>
                    This string must be unique across all links.
                  </p>
                </div>

                <div className='flex justify-end pt-4'>
                  <Button type='submit' disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Link'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Ref Code</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Toggle</TableHead>
                <TableHead className='w-[50px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className='space-y-3 p-6'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className='h-10 w-full' />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ) : links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    No referral links found.
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className='font-medium'>
                      {(Array.isArray(link.influencers)
                        ? link.influencers[0]?.full_name
                        : link.influencers?.full_name) || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='font-mono'>
                        {link.ref_code}
                      </Badge>
                    </TableCell>

                    <TableCell>{link.click_count}</TableCell>
                    <TableCell>{link.conversion_count}</TableCell>
                    <TableCell>
                      {link.is_active ? (
                        <Badge className='bg-green-500/15 text-green-700 hover:bg-green-500/25'>
                          Active
                        </Badge>
                      ) : (
                        <Badge variant='destructive'>Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Switch
                        checked={link.is_active}
                        onCheckedChange={() =>
                          toggleStatus(link.id, link.is_active)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950'
                        onClick={() => setDeleteId(link.id)}
                      >
                        <IconTrash className='size-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this referral link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
