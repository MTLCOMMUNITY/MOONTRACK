import { createFileRoute } from '@tanstack/react-router'
import { AdminReports } from '@/features/admin/reports'

export const Route = createFileRoute('/_authenticated/optcontrol/reports')({
  component: AdminReports,
})
