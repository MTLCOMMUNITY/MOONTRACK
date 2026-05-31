import { createFileRoute } from '@tanstack/react-router'
import { AdminReferrals } from '@/features/admin/referrals'

export const Route = createFileRoute('/_authenticated/optcontrol/referrals')({
  component: AdminReferrals,
})
