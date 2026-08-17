import type { Metadata } from 'next'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { placesRepository } from '@/db/repositories/placesRepository'
import { matchingService } from '@/services/matchingService'
import { PlacesPage } from '@/components/pages/PlacesPage'
import { redirect } from 'next/navigation'
import type { Place } from '@/db/schema'

export const metadata: Metadata = {
  title: "Let's Go — Choose Places",
  description: "Select locations for your matched activities.",
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

  const allChoices = await hangoutsRepository.getHangoutActivities(id)
  const matches = matchingService.calculateMatches(hangout.createdBy, allChoices as any)

  // Fetch places for each matched activity
  const matchedCategories: {
    activityId: string
    activityName: string
    activityIcon: string
    places: Place[]
  }[] = []

  for (const m of matches.matchedActivities) {
    let placesList = await placesRepository.getByCategory(m.activityId)
    // If no places found for this category, provide sample mock
    if (placesList.length === 0) {
      placesList = [
        {
          id: `sample-${m.activityId}-1`,
          name: `Spot for ${m.name}`,
          category: m.activityId,
          area: hangout.area,
          distanceKm: '1.0km',
          priceMin: 30000,
          priceMax: 70000,
          rating: '4.9',
          description: `Great environment for ${m.name.toLowerCase()}`,
        },
      ]
    }

    matchedCategories.push({
      activityId: m.activityId,
      activityName: m.name,
      activityIcon: m.icon,
      places: placesList,
    })
  }

  if (matchedCategories.length === 0) {
    redirect(`/hangouts/${id}/activities`)
  }

  return <PlacesPage hangoutId={id} matchedCategories={matchedCategories} />
}
