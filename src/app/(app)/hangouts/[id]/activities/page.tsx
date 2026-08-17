import type { Metadata } from 'next'
import { getSession } from '@/lib/session'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { getCachedActivities } from '@/db/cache'
import { ActivitiesPage } from '@/components/pages/ActivitiesPage'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Let's Go — Choose Activities",
  description: "Select and react to hangout activities.",
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  const currentUserId = session.userId || 'agam'

  const hangout = await hangoutsRepository.findById(id)
  if (!hangout) {
    redirect('/home')
  }

  const allActivities = await getCachedActivities()
  const existingChoices = await hangoutsRepository.getHangoutActivities(id)

  return (
    <ActivitiesPage
      hangout={hangout}
      allActivities={allActivities}
      currentUserId={currentUserId}
      existingChoices={existingChoices}
    />
  )
}
