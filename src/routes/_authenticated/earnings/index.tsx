import { createFileRoute } from '@tanstack/react-router'
import { Earnings } from '@/features/earnings'

export const Route = createFileRoute('/_authenticated/earnings/')({
  component: Earnings,
})
