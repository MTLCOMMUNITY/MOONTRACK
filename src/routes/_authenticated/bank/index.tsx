import { createFileRoute } from '@tanstack/react-router'
import { Bank } from '@/features/bank'

export const Route = createFileRoute('/_authenticated/bank/')({
  component: Bank,
})
