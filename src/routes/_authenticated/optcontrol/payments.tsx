import { createFileRoute } from '@tanstack/react-router'
import { AdminPayments } from '@/features/admin/payments'

export const Route = createFileRoute('/_authenticated/optcontrol/payments')({
  component: AdminPayments,
})
