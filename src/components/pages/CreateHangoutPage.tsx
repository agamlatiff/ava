'use client'

import { AdventurePlanner } from '@/components/planner/AdventurePlanner'

interface CreateHangoutPageProps {
  initialActivity?: string
}

export function CreateHangoutPage({ initialActivity }: CreateHangoutPageProps = {}) {
  return <AdventurePlanner initialActivity={initialActivity} />
}
