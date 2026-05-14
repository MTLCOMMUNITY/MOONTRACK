import { createFileRoute } from '@tanstack/react-router'
import { AdminConversions } from '@/features/admin/conversions'

export const Route = createFileRoute('/_authenticated/optcontrol/conversions')({
  component: AdminConversions,
})
