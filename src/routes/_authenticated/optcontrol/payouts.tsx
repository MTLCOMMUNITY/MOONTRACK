import { createFileRoute } from '@tanstack/react-router'
import { AdminPayouts } from '@/features/admin/payouts'

export const Route = createFileRoute('/_authenticated/optcontrol/payouts')({
  component: AdminPayouts,
})
