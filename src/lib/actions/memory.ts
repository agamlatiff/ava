'use server'

import { getSession } from '@/lib/session'
import { memoriesRepository } from '@/db/repositories/memoriesRepository'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { revalidatePath } from 'next/cache'

export async function saveMemoryAction(
  hangoutId: string,
  rating: number,
  note?: string
) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return { success: false, error: 'Unauthorized.' }
  }

  if (rating < 1 || rating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5.' }
  }

  try {
    await memoriesRepository.create({
      hangoutId,
      rating,
      note: note?.trim() || null,
    })

    await hangoutsRepository.updateStatus(hangoutId, 'completed')

    revalidatePath('/memories')
    revalidatePath('/home')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save memory.' }
  }
}
