'use server'

import { getSession } from '@/lib/session'
import { itineraryRepository } from '@/db/repositories/itineraryRepository'
import { revalidatePath } from 'next/cache'

export async function markActivityCompleteAction(
  hangoutId: string,
  itemId: string
) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return { success: false, error: 'Unauthorized.' }
  }

  try {
    await itineraryRepository.updateItemStatus(itemId, 'completed')

    // Find next upcoming item and mark it in_progress
    const allItems = await itineraryRepository.getByHangoutId(hangoutId)
    const nextUpcoming = allItems.find((item) => item.status === 'upcoming')
    if (nextUpcoming) {
      await itineraryRepository.updateItemStatus(nextUpcoming.id, 'in_progress')
    }

    revalidatePath(`/hangouts/${hangoutId}/today`)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update status.' }
  }
}
