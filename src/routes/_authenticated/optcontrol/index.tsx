import { createFileRoute } from '@tanstack/react-router'
import { AdminOverview } from '@/features/admin/overview'

export const Route = createFileRoute('/_authenticated/optcontrol/')({
  component: AdminOverview,
})
