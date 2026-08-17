import type { Metadata } from 'next'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { itineraryRepository } from '@/db/repositories/itineraryRepository'
import { ItineraryPage } from '@/components/pages/ItineraryPage'
import { redirect } from 'next/navigation'
import type { TimelineStop } from '@/components/ui/Timeline'

export const metadata: Metadata = {
  title: "Let's Go — Your Itinerary",
  description: "View the hangout timeline and itinerary stops.",
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
    status: s.status as any,
    order: s.order,
  }))

  const estimatedCost = rawStops.reduce((acc, s) => {
    return acc + (s.placePriceMin || 35000)
  }, 0)

  return (
    <ItineraryPage
      hangout={hangout}
      stops={stops}
      estimatedCost={hangout.budget || estimatedCost || 85000}
    />
  )
}
