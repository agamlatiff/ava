import type { Metadata } from 'next'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { itineraryRepository } from '@/db/repositories/itineraryRepository'
import { HangoutDayPage } from '@/components/pages/HangoutDayPage'
import { redirect } from 'next/navigation'
import type { TimelineStop } from '@/components/ui/Timeline'

export const metadata: Metadata = {
  title: "Let's Go — Today's Adventure",
  description: "Track your hangout day progress in real time.",
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const hangout = await hangoutsRepository.findById(id)
  if (!hangout) {
    redirect('/home')
  }

  const rawStops = await itineraryRepository.getByHangoutId(id)

  // Auto-mark first item as in_progress if none are active
  const hasInProgress = rawStops.some((s) => s.status === 'in_progress')
  if (!hasInProgress && rawStops.length > 0) {
    const first = rawStops.find((s) => s.status === 'upcoming')
    if (first) {
      await itineraryRepository.updateItemStatus(first.id, 'in_progress')
      first.status = 'in_progress'
    }
  }

  const stops: TimelineStop[] = rawStops.map((s) => ({
    id: s.id,
    startTime: s.startTime,
    endTime: s.endTime,
    activityIcon: s.activityIcon || '📍',
    activityName: s.activityName || 'Activity',
    placeName: s.placeName,
    placeArea: s.placeArea,
    placeDistance: s.placeDistance,
    placeDescription: s.placeDescription,
    status: s.status as TimelineStop['status'],
    order: s.order,
  }))

  return <HangoutDayPage hangout={hangout} stops={stops} />
}
