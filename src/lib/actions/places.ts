'use server'

import { getSession } from '@/lib/session'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { itineraryRepository } from '@/db/repositories/itineraryRepository'
import { itineraryService, type PlaceSelectionInput } from '@/services/itineraryService'
import { revalidatePath } from 'next/cache'

export async function savePlaceSelectionsAction(
  hangoutId: string,
  selections: PlaceSelectionInput[]
) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return { success: false, error: 'Unauthorized.' }
  }

  const hangout = await hangoutsRepository.findById(hangoutId)
  if (!hangout) {
    return { success: false, error: 'Hangout not found.' }
  }

  try {
    // 1. Clear old itinerary stops
    await itineraryRepository.clearByHangoutId(hangoutId)

    // 2. Generate scheduled stops
    const items = itineraryService.buildItineraryPlan(
      hangoutId,
      hangout.startTime,
      hangout.endTime,
      selections
    )

    // 3. Save to database
    await itineraryRepository.createMany(items)
    await hangoutsRepository.updateStatus(hangoutId, 'places_selected')

    revalidatePath(`/hangouts/${hangoutId}/itinerary`)
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to generate itinerary.'
    return { success: false, error: msg }
  }
}
