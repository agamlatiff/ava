import type { Metadata } from 'next'
import { AccessPage } from '@/components/pages/AccessPage'

export const metadata: Metadata = {
  title: "Let's Go — Enter Your Secret",
  description: "Access your private hangout planning space.",
}

export default function Page() {
  return <AccessPage />
}
