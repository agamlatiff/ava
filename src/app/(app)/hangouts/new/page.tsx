import type { Metadata } from 'next'
import { CreateHangoutPage } from '@/components/pages/CreateHangoutPage'

export const metadata: Metadata = {
  title: "Let's Go — New Hangout",
  description: "Plan a new hangout together.",
}

export default function Page() {
  return <CreateHangoutPage />
}
