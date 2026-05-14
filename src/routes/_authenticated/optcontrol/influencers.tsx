import { createFileRoute } from '@tanstack/react-router'
import { AdminInfluencers } from '@/features/admin/influencers'

export const Route = createFileRoute('/_authenticated/optcontrol/influencers')({
  component: AdminInfluencers,
})
